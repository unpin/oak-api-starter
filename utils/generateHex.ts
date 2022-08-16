const VALUES = "0123456789abcdef";

export function generateHexString(n = 16) {
  return Array.from(Array(n), () => VALUES[Math.floor(Math.random() * 16)])
    .join("");
}
