import { NextResponse } from "next/server";
import axios from 'axios';
import prisma from '../../../../../prisma';
import { Movie } from '@/components/utils/Movietype';
import { connectToDB } from '../../../../../helpers/server-helpers';
import { ObjectId } from 'mongodb';


export const POST = async (req: Request) => {
  if (req.method === 'POST') {
    try {
      await connectToDB();
      const response = await axios.get<Movie[]>('http://localhost:8080/imdb/tvmeter');
      console.log(response.data);
      const movies = response.data.map(movie => ({
        ...movie,
        id: new ObjectId().toHexString(),
        rating_count: Number(movie.rating_count),
        rating_value: Number(movie.rating_value),
        trailer: movie.trailer ?? '',
      }));
      let createdCount = 0;

      for (const movie of movies) {
       
        const existingMovie = await prisma.movie.findUnique({
          where: {
            ttid: movie.ttid
          }
        });

        if (!existingMovie) {
          await prisma.movie.create({
            data: movie
          });
          createdCount++;
        }
      }

      const done: boolean = createdCount > 0; 

      return NextResponse.json({ done }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({message:"server error"}, {status:500});
    }finally {
       await prisma.$disconnect();
    }
  } else {
    return NextResponse.json({message:"method not allowed"}, {status:405});
  }
}
