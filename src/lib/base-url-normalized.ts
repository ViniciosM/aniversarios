
/**
 * Normalizes a base URL and an optional path to form a complete URL.
 *
 * @param path - An optional path to be appended to the base URL. If the path starts with '/', it will be considered as an absolute path.
 *
 * @returns A complete URL formed by concatenating the base URL and the normalized path.
 * If no path is provided, the base URL will be returned as is.
 * If the path is not provided or is an empty string, an empty string will be returned.
 *
 * @example
 * ```typescript
 * const baseUrl = baseUrlNormalized(); // Returns the base URL from the environment variable or an empty string.
 * const completeUrl = baseUrlNormalized('users'); // Returns the base URL followed by '/users'.
 * ```
 */
export function baseUrlNormalized(path?: string) {
    const baseUrl = process.env.APP_WEB_PUBLIC_URL || ''
    const normalizedPath = path && !path.startsWith('/') ? `/${path}` : path || ''
    return `${baseUrl}${normalizedPath}`
}