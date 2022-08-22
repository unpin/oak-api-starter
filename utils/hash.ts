export async function sha256(str: string) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return Array.prototype.map.call(
    new Uint8Array(buffer),
    (x) => (("00" + x.toString(16)).slice(-2)),
  ).join("");
}
