export const apiClient = async (
  url: string,
  options: RequestInit = {}
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};
