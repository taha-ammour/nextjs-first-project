import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../helpers/server-helpers";
import prisma from "../../../../../prisma";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    try {
        const {name,email,password} = await req.json();
        if(!name || !email || !password) 
            return NextResponse.json({message:"Invalid Data"}, {status: 422});
        const hashpassword = await bcrypt.hash(password,10)
        await connectToDB()
        const user = await prisma.user.create({data:{email, username:name, hashedPassword:hashpassword }})
        return NextResponse.json({user},{status: 201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"server error"}, {status:500});
    } finally {
        await prisma.$disconnect();
    }
};