/**
 * Logger utility that strips sensitive data before logging
 * Prevents exposure of secrets, tokens, passwords, etc. in browser dev tools
 */

const SENSITIVE_KEYS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "jwt",
  "secret",
  "apiKey",
  "email",
  "phone",
  "ssn",
  "creditCard",
  "apiSecret",
  "private",
  "key",
  "authorization",
  "auth",
];

const SENSITIVE_PATTERNS = [
  /bearer\s+[\w\-._~+/]+=*/gi, // Bearer tokens
  /token[=:]\s*["']?[\w\-._~+/]+=*["']?/gi, // Token patterns
  /password[=:]\s*["']?[^"'\s]+["']?/gi, // Passwords
  /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, // Email addresses
  /\b\d{3}-\d{3}-\d{4}\b/g, // Phone numbers
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card patterns
];

/**
 * Check if a key is sensitive
 */
function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(
    (sensitiveKey) =>
      lowerKey.includes(sensitiveKey) || lowerKey === sensitiveKey,
  );
}

/**
 * Redact a value
 */
function redactValue(value: string): string {
  if (typeof value !== "string" || value.length === 0) {
    return "[REDACTED]";
  }

  let redacted = value;

  // Apply sensitive patterns
  SENSITIVE_PATTERNS.forEach((pattern) => {
    redacted = redacted.replace(pattern, "[REDACTED]");
  });

  // If value was modified by pattern matching or is a token-like string, redact it
  if (
    redacted !== value ||
    (value.length > 20 && /^[\w\-._~+/=]+$/.test(value))
  ) {
    return "[REDACTED]";
  }

  return redacted;
}

/**
 * Deep clone and strip sensitive data from an object
 */
function stripSensitiveData(obj: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) {
    return "[REDACTED - DEPTH LIMIT]";
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return redactValue(obj);
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => stripSensitiveData(item, depth + 1));
    }

    const stripped: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isSensitiveKey(key)) {
          stripped[key] = "[REDACTED]";
        } else {
          stripped[key] = stripSensitiveData(obj[key], depth + 1);
        }
      }
    }
    return stripped;
  }

  return obj;
}

/**
 * Safe console.log - strips sensitive data before logging
 * Use this instead of console.log in development
 */
export const logger = {
  /**
   * Log data (safe for production and development)
   */
  log: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      const strippedArgs = args.map((arg) => stripSensitiveData(arg));
      console.log(...strippedArgs);
    }
  },

  /**
   * Log errors (safe for production and development)
   */
  error: (...args: any[]): void => {
    const strippedArgs = args.map((arg) => stripSensitiveData(arg));
    console.error(...strippedArgs);
  },

  /**
   * Log warnings (safe for production and development)
   */
  warn: (...args: any[]): void => {
    const strippedArgs = args.map((arg) => stripSensitiveData(arg));
    console.warn(...strippedArgs);
  },

  /**
   * Log info (safe for production and development)
   */
  info: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      const strippedArgs = args.map((arg) => stripSensitiveData(arg));
      console.info(...strippedArgs);
    }
  },

  /**
   * Log debug info (only in development)
   */
  debug: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      const strippedArgs = args.map((arg) => stripSensitiveData(arg));
      console.debug(...strippedArgs);
    }
  },

  /**
   * Log table (only in development)
   */
  table: (data: any[]): void => {
    if (import.meta.env.DEV) {
      const strippedData = stripSensitiveData(data);
      console.table(strippedData);
    }
  },
};

export default logger;
