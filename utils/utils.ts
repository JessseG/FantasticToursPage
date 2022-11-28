export async function fetchData(url: any) {
  const res = await fetch(url);
  const response = await res.json();
  return response;
}
