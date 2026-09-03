import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prevent Next.js from caching the dashboard data so it always shows the latest assignments
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        assignments: {
          include: {
            student: {
              include: {
                classRoom: true
              }
            }
          }
        }
      }
    });

    // Format the database data to match the UI structure
    const formattedClubs = clubs.map(club => ({
      id: club.id,
      name: club.name,
      type: club.category,
      students: club.assignments.map(a => ({
        id: a.student.studentId,
        name: a.student.name,
        form: a.student.classRoom.form,
        class: a.student.classRoom.name,
      }))
    }));

    return NextResponse.json(formattedClubs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}