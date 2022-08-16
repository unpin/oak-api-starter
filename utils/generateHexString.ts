export function generateHexString(length = 16) {
  return Array.from(
    Array(length),
    () => Math.floor(Math.random() * 16).toString(16),
  )
    .join("");
}
