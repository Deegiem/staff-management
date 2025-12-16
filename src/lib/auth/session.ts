// import  prisma  from "../prisma";

// export const createSession = async (staffId: string, refreshToken: string, expiresAt: Date) =>
//   prisma.session.create({ data: { staffId, refreshToken, expiresAt } });

// export const revokeSession = async (refreshToken: string) =>
//   prisma.session.updateMany({ where: { refreshToken }, data: { revoked: true } });


// lib/auth/session.ts
import prisma from "../prisma";
import { v4 as uuidv4 } from "uuid";

/**
 * Session management helpers.
 *
 * Expectation:
 * - Prisma session model has at least: id (string, PK), staffId (string), refreshToken (string), expiresAt (DateTime), revoked (boolean), replacedBy (string | null)
 *
 * Functions:
 *  - createSession: create a session row using supplied sessionId (UUID recommended).
 *  - revokeSession: mark session revoked and optionally set replacedBy.
 *  - getSessionById: fetch a session by its id.
 *  - rotateSession: convenience wrapper to atomically revoke old session and create new one.
 */

export const createSession = async (
  staffId: string,
  sessionId: string,
  expiresAt: Date,
  refreshToken: string
) => {
  return prisma.session.create({
    data: {
      id: sessionId,
      staffId,
      refreshToken,
      expiresAt,
      revoked: false,
    },
  });
};

export const revokeSession = async (sessionId: string, replacedBy?: string) => {
  return prisma.session.updateMany({
    where: { 
      id: sessionId,
      revoked: false
    },
    data: {
      revoked: true,
      replacedBy: replacedBy ?? null,
    },
  });
};

export const getSessionById = async (sessionId: string) => {
  return prisma.session.findUnique({
    where: { id: sessionId },
  });
};

export const getSessionByRefreshToken = async (refreshToken: string) => {
  return prisma.session.findUnique({
    where: { refreshToken },
  });
};

/**
 * Atomically rotate session:
 * - mark old session revoked + replacedBy newSessionId
 * - create new session row
 * Returns the new session id.
 */
export const rotateSession = async (
  oldSessionId: string,
  staffId: string,
  newExpiresAt: Date,
  newRefreshToken: string
) => {
  const newSessionId = uuidv4();

  await prisma.$transaction([
    prisma.session.update({
      where: { id: oldSessionId },
      data: {
        revoked: true,
        replacedBy: newSessionId,
      },
    }),
    prisma.session.create({
      data: {
        id: newSessionId,
        staffId,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
        revoked: false,
      },
    }),
  ]);

  return newSessionId;
};