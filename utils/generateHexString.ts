export function generateHexString(n = 16) {
  return Array.from(Array(n), () => Math.floor(Math.random() * 16).toString(16))
    .join("");
}
