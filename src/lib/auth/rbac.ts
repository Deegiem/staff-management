// export const requirePermission = (staffRole: string, requiredRole: string) => {
//   return staffRole === requiredRole;
// };


// lib/auth/rbac.ts

/**
 * Simple RBAC helper:
 * - requiredRole can be a string or an array of allowed role names.
 * - returns true if staffRole is included in requiredRole or equals the requiredRole.
 *
 * This is intentionally simple — if you need hierarchy or role levels, extend it.
 */

export const requirePermission = (staffRole: string, requiredRole: string | string[]) => {
  if (!staffRole) return false;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(staffRole);
  }
  return staffRole === requiredRole;
};
