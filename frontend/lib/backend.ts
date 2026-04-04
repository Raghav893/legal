const publicApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const internalApiBase = process.env.BACKEND_INTERNAL_URL || publicApiBase;

export function getPublicApiBase() {
  return publicApiBase;
}

export function getInternalApiBase() {
  return internalApiBase;
}

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${internalApiBase}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}
