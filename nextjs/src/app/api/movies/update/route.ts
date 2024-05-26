import { NextResponse } from "next/server";
import axios from 'axios';
import prisma from '../../../../../prisma';
import { Movie } from '@/components/utils/Movietype';
import { connectToDB } from '../../../../../helpers/server-helpers';
import { ObjectId } from 'mongodb';

export const POST = async (req: Request) => {
  try {
    await connectToDB();
    console.log("Connected to DB");

    const response = await axios.get<Movie[]>('http://localhost:8080/imdb/tvmeter');
    console.log("Fetched data from external API:", response.data);

    const movies = response.data.map(movie => ({
      id: new ObjectId().toHexString(),
      ttid: movie.ttid,
      title: movie.title,
      description: movie.description || "", // Ensure description is always a string
      img_high: movie.img_high || "",
      link: movie.link,
      rating_count: Number(movie.rating_count),
      rating_value: Number(movie.rating_value),
      release_date: movie.release_date || "",
      runtime: movie.runtime || "",
      trailer: movie.trailer || "",
      type: movie.type,
      genres: movie.genres,
    }));
    console.log("Mapped movies data:", movies);

    let createdCount = 0;

    for (const movie of movies) {
      const existingMovie = await prisma.movie.findUnique({
        where: {
          ttid: movie.ttid
        }
      });
      console.log(`Checked for existing movie with ttid ${movie.ttid}:`, existingMovie);

      if (!existingMovie) {
        await prisma.movie.create({
          data: movie
        });
        console.log("Created new movie:", movie);
        createdCount++;
      }
    }

    const done: boolean = createdCount > 0;
    console.log("Created count:", createdCount);

    return NextResponse.json({ done }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in POST /api/movies/update:", error.message);
      return NextResponse.json({ message: "server error: " + error.message }, { status: 500 });
    } else {
      console.error("Unexpected error in POST /api/movies/update:", error);
      return NextResponse.json({ message: "server error" }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from DB");
  }
}

export function GET(req: Request) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
