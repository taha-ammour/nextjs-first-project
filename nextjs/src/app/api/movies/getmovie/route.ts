import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

import { connectToDB } from '../../../../../helpers/server-helpers';
export const GET = async (
  req: Request,
) =>  {
  if (req.method === "GET") {
    try {
      await connectToDB();
      const movies = await prisma.movie.findMany();
      
      return NextResponse.json({ movies }, { status: 201 });
    } catch (error) {
      console.error("Error fetching movies:", error);
      return NextResponse.json({message:"server error"}, {status:500});
    }finally {
        await prisma.$disconnect();
    }
  } else {
    return NextResponse.json({message:"method not allowed"}, {status:405});
  }
}
