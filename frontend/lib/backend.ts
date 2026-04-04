const publicApiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const internalApiBase = process.env.BACKEND_INTERNAL_URL || publicApiBase;

export function getPublicApiBase() {
  return publicApiBase;
}

export function getInternalApiBase() {
  return internalApiBase;
}

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getSession } = await import("@/lib/auth");
  const { redirect } = await import("next/navigation");
  const session = await getSession();
  if (!session?.token) {
    redirect("/login");
  }

  const response = await fetch(`${internalApiBase}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(init?.headers || {})
    }
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}

export async function backendProxy(path: string, init?: RequestInit) {
  const { getSession } = await import("@/lib/auth");
  const { NextResponse } = await import("next/server");
  const session = await getSession();

  if (!session?.token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${internalApiBase}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
      ...(init?.headers || {})
    }
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
