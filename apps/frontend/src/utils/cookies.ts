import Cookies from 'js-cookie';

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, options?: Cookies.CookieAttributes): void {
  Cookies.set(name, value, options);
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string, options?: Cookies.CookieAttributes): void {
  Cookies.remove(name, options);
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return Cookies.get(name) !== undefined;
}

/**
 * Get user ID from cookie
 */
export function getUserId(): string | undefined {
  return Cookies.get('user_id');
}
