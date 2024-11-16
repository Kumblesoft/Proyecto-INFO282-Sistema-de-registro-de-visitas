
/**
 * Calls the function and wraps in a try-catch to return [error, value]
 * @param {function} fn 
 * @param  {...any} args 
 * @returns [error, value]
 */
export function getSafe(fn, ...args) {
    try {
      return [null, fn(...args)]
    } catch (error) {
      return [error, null]
    }
}

/**
 * Calls the async function and wraps in a try-catch to return [error, value]
 * @param {function} fn 
 * @param  {...any} args 
 * @returns [error, value]
 */
export async function getSafeAsync(fn, ...args) {
    try {
        const val = await fn(...args)
        return [null, val]
    } catch (error) {
        return [error, null]
    }
}