import { NextResponse } from  "next/server";
import { connectDB } from "@/app/lib/mongodb";   
import usersModel from "@/app/model/user";
import bcrypt from 'bcryptjs'; 

export async function POST(req) {
     await connectDB();
    const {name, email, password, role} = await req.json();
    console.log("typeof password:", typeof password, "password value:", password);
    const existingUser = await usersModel.findOne({email}); 
    if(existingUser){
        return NextResponse.json({message: "User already registered"}, {status: 400});  
    }

    const hashed =await bcrypt.hash(password, 10);
    await usersModel.create({name, email, password: hashed, role});

    return NextResponse.json({message: "User registered successfully"}, {status: 201});
}