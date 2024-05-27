import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../../helpers/server-helpers';
import prisma from '../../../../../prisma';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

export const POST = async (req: Request) => {
  try {
    await connectToDB();

    const session = await getServerSession({ req, ...options });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { ttid, description, img_high, link, rating_count, rating_value, release_date, runtime, title, trailer, type, genres } = await req.json();
    if (!ttid) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 422 });
    }

    const userId = session.user.id;

    let movie = await prisma.movie.findUnique({
      where: { ttid },
    });

    if (!movie) {
      movie = await prisma.movie.create({
        data: {
          ttid,
          description,
          img_high,
          link,
          rating_count,
          rating_value,
          release_date,
          runtime,
          title,
          trailer,
          type,
          genres,
        },
      });
    }

    const watchlist = await prisma.watchlist.create({
      data: {
        userId,
        movieId: movie.id,
      },
    });

    return NextResponse.json({ watchlist }, { status: 201 });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
