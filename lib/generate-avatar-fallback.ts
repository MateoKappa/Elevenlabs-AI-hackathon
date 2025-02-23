export function generateAvatarFallback(string: string) {
  console.log(string, "string");

  const names = string?.split(" ").filter((name: string) => name);
  const mapped = names.map((name: string) => name.charAt(0).toUpperCase());

  return mapped.join("");
}
