const OPEN_KEY = "op";

export function parseOpenId(params: URLSearchParams) {
  const id = Number(params.get(OPEN_KEY));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function writeOpenId(params: URLSearchParams, id: number | null) {
  if (id === null) params.delete(OPEN_KEY);
  else params.set(OPEN_KEY, String(id));
  return params;
}

export function detailPath(id: number) {
  return `/oportunidades/${id}`;
}
