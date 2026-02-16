export async function logout(): Promise<any> {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to log out");
  return res.json();
}