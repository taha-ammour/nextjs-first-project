import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../helpers/server-helpers';
import prisma from '../../../../../prisma';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

export const GET = async (req: Request) => {
  try {
    await connectToDB();

    const session = await getServerSession({ req, res: NextResponse, ...options });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: userId },
      include: { movie: true },
    });

    return NextResponse.json({ watchlist }, { status: 200 });
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
