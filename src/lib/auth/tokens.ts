import prisma from "../prisma";
import crypto from "crypto";

export const createVerificationToken = async (staffId: string, type: string, hours: number) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  return prisma.verificationToken.create({
    data: { staffId, token, type, expiresAt },
  });
};

export const consumeVerificationToken = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.used || record.expiresAt < new Date()) return null;
  await prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } });
  return record;
};
