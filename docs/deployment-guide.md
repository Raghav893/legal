# LexOra — Deployment Guide

> This document explains how to deploy LexOra to AWS for production use. It covers infrastructure setup, environment configuration, Docker-based container deployment, Nginx reverse proxy configuration, SSL termination, CI/CD with GitHub Actions, and post-deployment verification.

---

## Architecture Overview

```
Internet
   │
   ▼
AWS Route 53 (DNS)
   │
   ▼
AWS ACM (SSL Certificate)
   │
   ▼
EC2 Instance (or ECS Cluster)
   ├── Nginx (port 80 → 443 redirect, reverse proxy)
   ├── Next.js Docker container (port 3000)
   └── Spring Boot Docker container (port 8080) [planned]
         │
         ▼
   AWS RDS PostgreSQL [planned]

External Services:
   ├── Supabase (Auth + DB + Storage — current)
   └── AWS S3 (document storage — planned with Spring Boot)
```

---

## Phase 1: Current Deployment (Next.js + Supabase)

This phase covers deploying the existing Next.js application that uses Supabase for auth, database, and storage. No Spring Boot service is required at this stage.

---

### Step 1: Provision an AWS EC2 Instance

1. Log into the [AWS Console](https://console.aws.amazon.com)
2. Go to **EC2 → Launch Instance**
3. Choose **Ubuntu 22.04 LTS** as the AMI
4. Select instance type: **t3.small** (minimum; t3.medium recommended for production)
5. Configure storage: **20 GB gp3** EBS volume
6. **Security Group rules:**

| Type | Protocol | Port | Source |
|---|---|---|---|
| SSH | TCP | 22 | Your IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom (Next.js) | TCP | 3000 | Security group (internal) |
| Custom (Spring Boot) | TCP | 8080 | Security group (internal, planned) |

7. Create or select an existing **key pair** and save the `.pem` file
8. Launch the instance and note the **Public IPv4 address**

---

### Step 2: Assign an Elastic IP

Elastic IPs prevent your public IP from changing on instance restart:

1. Go to **EC2 → Elastic IPs → Allocate Elastic IP**
2. Click **Associate Elastic IP** and select your instance
3. Point your domain (`lexora.yourdomain.com`) to this IP via Route 53 or your DNS provider

---

### Step 3: Connect to the Instance and Install Dependencies

```bash
# Connect via SSH
ssh -i your-keypair.pem ubuntu@<your-elastic-ip>

# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add ubuntu user to docker group (avoid using sudo each time)
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

---

### Step 4: Clone the Repository

```bash
# Install Git
sudo apt install -y git

# Clone your repository
git clone https://github.com/your-org/lexora.git
cd lexora
```

---

### Step 5: Configure Environment Variables

```bash
# Create the environment file
cp .env.example .env
nano .env
```

Set the following values:

```env
# Supabase (get from Supabase Dashboard → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Domain
DOMAIN_NAME=lexora.yourdomain.com
```

For the frontend specifically:

```bash
cd frontend
cp .env.local.example .env.local 2>/dev/null || touch .env.local
nano .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 6: Build and Run the Docker Container

**`frontend/Dockerfile`** (existing):
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**`docker-compose.yml`** (root-level):
```yaml
version: "3.9"

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: lexora_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    environment:
      - NODE_ENV=production
```

Run:

```bash
# From the project root
docker compose up -d --build

# Verify it's running
docker ps
docker logs lexora_frontend
```

The Next.js app should now be accessible at `http://<your-ip>:3000`.

---

### Step 7: Configure Nginx as Reverse Proxy

Install Nginx:

```bash
sudo apt install -y nginx
```

Create a site configuration:

```bash
sudo nano /etc/nginx/sites-available/lexora
```

Paste the following:

```nginx
server {
    listen 80;
    server_name lexora.yourdomain.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lexora.yourdomain.com;

    # SSL — managed by Certbot (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/lexora.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lexora.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy to Spring Boot (add when ready)
    # location /api/v2/ {
    #     proxy_pass http://localhost:8080;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/lexora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 8: SSL with Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Issue the certificate
sudo certbot --nginx -d lexora.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically update your Nginx config and set up a cron job for renewal.

---

### Step 9: Verify Deployment

```bash
# Check Next.js container is running
docker ps

# Check Nginx status
sudo systemctl status nginx

# Test HTTPS
curl -I https://lexora.yourdomain.com
```

Open `https://lexora.yourdomain.com` in a browser — you should see the LexOra login page.

---

## Phase 2: Adding Spring Boot Backend (Planned)

When the Spring Boot backend is ready, it will be added as a second Docker service.

### Docker Compose Update

```yaml
version: "3.9"

services:
  frontend:
    build:
      context: ./frontend
    container_name: lexora_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: lexora_backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://<rds-endpoint>:5432/lexora
      - SPRING_DATASOURCE_USERNAME=lexora_user
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
      - AWS_S3_BUCKET=lexora-documents
      - AWS_REGION=ap-south-1
    env_file:
      - .env
```

### AWS RDS Setup

1. Go to **RDS → Create Database**
2. Engine: **PostgreSQL 15**
3. Template: **Production**
4. DB Instance: `db.t3.micro` (dev) / `db.t3.small` (prod)
5. Enable **Multi-AZ** for high availability
6. Set **VPC security group** to allow inbound 5432 from the EC2 security group only (never expose PostgreSQL to the internet)
7. Note the endpoint URL and update the `SPRING_DATASOURCE_URL` environment variable

### Spring Boot `Dockerfile`

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/lexora-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/lexora
            git pull origin main
            docker compose up -d --build
            docker system prune -f
```

**Required GitHub Secrets:**

| Secret | Value |
|---|---|
| `EC2_HOST` | Your Elastic IP address |
| `EC2_SSH_KEY` | Contents of your `.pem` key file |

Every push to `main` will automatically SSH into the EC2 instance, pull the latest code, rebuild Docker containers, and prune old images.

---

## Monitoring and Maintenance

### View Logs

```bash
# Next.js logs
docker logs -f lexora_frontend

# Spring Boot logs (when added)
docker logs -f lexora_backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart all containers
docker compose restart

# Restart only frontend
docker compose restart frontend

# Reload Nginx without downtime
sudo nginx -s reload
```

### Backup the Database

```bash
# For Supabase: use the Supabase Dashboard backup feature (Settings → Database → Backups)
# For RDS: AWS automatically creates daily snapshots. Manual snapshot:
aws rds create-db-snapshot \
  --db-instance-identifier lexora-db \
  --db-snapshot-identifier lexora-db-$(date +%Y%m%d)
```

---

## Security Checklist

- [ ] SSH access restricted to your IP only in Security Groups
- [ ] PostgreSQL port 5432 not exposed to the internet
- [ ] All secrets stored in AWS Secrets Manager (not hardcoded in `.env`)
- [ ] HTTPS enforced via Nginx redirect from port 80
- [ ] Supabase RLS enabled on all tables
- [ ] Docker containers run as non-root users
- [ ] `npm audit` or `trivy` scans run in CI pipeline
- [ ] SSL certificate auto-renewal tested
- [ ] EC2 instance patches applied monthly
