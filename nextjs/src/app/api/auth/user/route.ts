import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../helpers/server-helpers"
import prisma from "../../../../../prisma";

export const GET = async () => {
    try {
        await connectToDB();
        const users = await prisma.user.findMany();
        return NextResponse.json({users},{status: 200});
    } catch (error) {
        
        return NextResponse.json({error:"server error"},{status: 500});
    }finally {
        await prisma.$disconnect();
    }
}