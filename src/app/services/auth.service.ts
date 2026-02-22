export async function logout(): Promise<any> {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to log out");
  return res.json();
}

export async function verifyRole(): Promise<{ role: string }> {
  const res = await fetch(`/api/auth/verify-role`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to verify role");
  return res.json();
}