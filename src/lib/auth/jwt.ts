// import jwt from "jsonwebtoken";

// const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// if (!ACCESS_SECRET || !REFRESH_SECRET) {
//   throw new Error("JWT secrets not found in env variables!");
// }
 
// export const signAccessToken = (payload: object) =>
//   jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });

// export const signRefreshToken = (payload: object) =>
//   jwt.sign(payload, REFRESH_SECRET, { expiresIn: "1d" });
// console.log("ACCESS_SECRET loaded:", !!process.env.JWT_ACCESS_SECRET);
// console.log("REFRESH_SECRET loaded:", !!process.env.JWT_REFRESH_SECRET);

// export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET);
// export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);


// lib/auth/jwt.ts
import jwt from "jsonwebtoken";

/**
 * Configurable token durations (string formats supported by jsonwebtoken's expiresIn)
 * You can override these with environment variables:
 *  - JWT_ACCESS_EXPIRES  (e.g. "15m")
 *  - JWT_REFRESH_EXPIRES (e.g. "7d")
 *
 * Also export cookie max-age values in seconds for consistent cookie-setting.
 */

export const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m"; // default 15 minutes
export const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d"; // default 7 days

// cookie max ages in seconds (derived from the above defaults but overridable)
export const ACCESS_COOKIE_MAX_AGE = parseInt(process.env.ACCESS_COOKIE_MAX_AGE_SEC || `${15 * 60}`, 10); // 15 minutes
export const REFRESH_COOKIE_MAX_AGE = parseInt(process.env.REFRESH_COOKIE_MAX_AGE_SEC || `${7 * 24 * 60 * 60}`, 10); // 7 days

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in environment variables.");
}

export type AccessPayload = {
  staffId: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type RefreshPayload = {
  staffId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
};

export const signAccessToken = (payload: Omit<AccessPayload, "iat" | "exp">) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });

export const signRefreshToken = (payload: Omit<RefreshPayload, "iat" | "exp">) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });

/**
 * Safe verification helpers: return the typed payload on success, or null on failure.
 * This avoids throwing in call sites and centralizes jwt verify semantics.
 */
export const verifyAccessToken = (token: string): AccessPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
  } catch (err) {
    return null;
  }
};
