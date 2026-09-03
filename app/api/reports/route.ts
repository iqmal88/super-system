import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: 'asc' },
      include: {
        assignments: {
          include: {
            student: { include: { classRoom: true } }
          }
        }
      }
    });

    const formattedReports = clubs.map(club => ({
      id: club.id,
      name: club.name,
      category: club.category,
      students: club.assignments.map(a => ({
        studentId: a.student.studentId,
        name: a.student.name,
        form: a.student.classRoom.form,
        className: a.student.classRoom.name,
      })).sort((a, b) => 
        a.form.localeCompare(b.form) || 
        a.className.localeCompare(b.className) || 
        a.name.localeCompare(b.name)
      )
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
  }
}