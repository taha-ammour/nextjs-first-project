// src/app/api/user/change-password/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../helpers/server-helpers';
import prisma from '../../../../../prisma';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

export const PUT = async (req: Request) => {
  try {
    await connectToDB();

    const session = await getServerSession({ req, res: NextResponse, ...options });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 422 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedPassword || !(await bcrypt.compare(currentPassword, user.hashedPassword))) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
