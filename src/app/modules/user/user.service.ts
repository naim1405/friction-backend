import type { Request } from 'express';
import { prisma } from '../../../lib/prisma';
import type { IAdmin } from './user.interface';
import { bcryptUtils } from '../../../helpers/bcrypt';

const createAdmin = async (req: Request) => {
  const {
    admin: { name, phone, email },
    password,
  } = req.body as IAdmin;

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    throw new Error('Admin with this email already exists');
  }

  const hashedPassword = await bcryptUtils.hashedPassword(password);

  const admin = await prisma.user.create({
    data: {
      phone,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      admins: {
        create: {
          name,
          phone,
          email,
        },
      },
    },
  });

  return admin;
};

export const UserServices = {
  createAdmin,
};
