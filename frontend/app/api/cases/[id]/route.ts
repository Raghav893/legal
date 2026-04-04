import { backendProxy } from "@/lib/backend";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return backendProxy(`/cases/${params.id}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}
