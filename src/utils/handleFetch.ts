const http = async <T>(path: string, config: RequestInit): Promise<T> => {
  const req = new Request(path, config);
  const res = await fetch(req);

  if (!res.ok) throw new Error(JSON.stringify({ name: res.status, message: res.statusText }, null, 2));

  // because we may error
  return res.json().catch(() => ({}));
};

export const GET = async <T>(path: string, config?: RequestInit): Promise<T> => {
  const init = { method: "GET", ...config };
  return await http<T>(path, init);
};

export const POST = async <T, R>(path: string, body: T, config?: RequestInit): Promise<R> => {
  const init = { method: "POST", body: JSON.stringify(body), ...config };
  return await http<R>(path, init);
};
