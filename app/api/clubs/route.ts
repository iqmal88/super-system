import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({ orderBy: { name: 'asc' } });
    
    // Fetch classes, students, AND their current club assignments
    const classes = await prisma.classRoom.findMany({
      include: { 
        students: { 
          orderBy: { name: 'asc' },
          include: {
            assignments: {
              include: { club: true } // Bring in the club details to check categories
            }
          }
        } 
      },
      orderBy: [{ form: 'asc' }, { name: 'asc' }]
    });

    return NextResponse.json({ clubs, classes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, category } = await req.json();
    
    if (!name || !category) return NextResponse.json({ error: 'Missing club name or category' }, { status: 400 });

    const club = await prisma.club.create({ data: { name, category } });
    return NextResponse.json({ success: true, club, message: `${name} created successfully!` });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'A club with this name already exists.' }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
  }
}