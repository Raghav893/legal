export const API_BASE_URL = "/api";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export const dashboardApi = {
  summary: () => api<any>("/dashboard/summary")
};

export const clientApi = {
  list: () => api<any[]>("/clients")
};

export const caseApi = {
  list: () => api<any[]>("/cases")
};

export const hearingApi = {
  list: () => api<any[]>("/hearings")
};
