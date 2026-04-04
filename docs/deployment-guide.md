# Deployment Guide

## Local Docker Run

1. Copy `.env.example` to `.env`
2. Run `docker-compose up --build`

## Cloud Deployment Options

### AWS / VPS

- deploy the Next.js container behind Nginx or a load balancer
- mount persistent storage for `frontend/data`
- move to a managed database later if you need multi-instance scaling

### Render

- deploy as a single web service
- use a persistent disk if you want file-backed persistence

## Recommended Production Adjustments

- replace JSON storage with Prisma + PostgreSQL when ready
- add HTTPS via Nginx or managed ingress
- rotate JWT secret via secret manager
- add audit logs and notification jobs
