import Cookies from 'js-cookie';

const USER_ID_STORAGE_KEY = 'user_id';

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
 * Get user ID from cookie (primary) or localStorage (fallback for incognito mode)
 * Since httpOnly is false, cookies are readable, but localStorage provides fallback
 */
export function getUserId(): string | undefined {
  // Try cookie first (works in normal mode)
  const cookieUserId = Cookies.get('user_id');
  if (cookieUserId) {
    return cookieUserId;
  }
  
  // Fallback to localStorage (works in incognito mode)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  }
  
  return undefined;
}

/**
 * Set user ID in localStorage (for incognito mode fallback)
 * Cookie is set by backend, but we store in localStorage as backup
 */
export function setUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
}

/**
 * Remove user ID from localStorage
 */
export function removeUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }
}
