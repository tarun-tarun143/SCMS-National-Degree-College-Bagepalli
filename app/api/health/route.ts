import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({status:"ok",service:"SCMS",storage:"Firebase Storage disabled",developer:"Tarun D",timestamp:new Date().toISOString()});}
