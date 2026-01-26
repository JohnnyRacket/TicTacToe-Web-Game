/**
 * Generate a random hex color code
 * @returns A hex color string in the format #RRGGBB
 * @see https://css-tricks.com/snippets/javascript/random-hex-color/
 */
export function generateRandomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}
