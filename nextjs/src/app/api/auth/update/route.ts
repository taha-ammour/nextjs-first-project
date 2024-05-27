// src/app/api/user/update/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../helpers/server-helpers';
import prisma from '../../../../../prisma';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

export const PUT = async (req: Request) => {
  try {
    await connectToDB();

    const session = await getServerSession({ req: req as any, res: NextResponse, ...options });

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 422 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { username: name, email },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
