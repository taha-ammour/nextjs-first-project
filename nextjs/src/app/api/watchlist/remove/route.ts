
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../helpers/server-helpers';
import prisma from '../../../../../prisma';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

export const DELETE = async (req: Request) => {
  try {
    await connectToDB();

    const session = await getServerSession({ req, ...options });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { movieId } = await req.json();
    if (!movieId) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 422 });
    }

    const userId = session.user.id;

    await prisma.watchlist.deleteMany({
      where: {
        userId,
        movieId,
      },
    });

    return NextResponse.json({ message: 'Removed from watchlist' }, { status: 200 });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
