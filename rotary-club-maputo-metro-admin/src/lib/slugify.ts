export function slugify(text: string): string {
  const NFD_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
  return text
    .normalize("NFD")
    .replace(NFD_DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
