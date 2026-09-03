import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // We now expect an array of studentIds
    const { studentIds, clubId } = await req.json();

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0 || !clubId) {
      return NextResponse.json({ error: 'Please select at least one student and a club.' }, { status: 400 });
    }

    // Map the array into the format Prisma needs
    const assignmentsData = studentIds.map((id: string) => ({
      studentId: id,
      clubId: clubId
    }));

    // createMany inserts them all at once. skipDuplicates prevents errors if a duplicate slips through
    await prisma.clubAssignment.createMany({
      data: assignmentsData,
      skipDuplicates: true, 
    });

    return NextResponse.json({ success: true, message: `Successfully assigned ${studentIds.length} student(s)!` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to assign students.' }, { status: 500 });
  }
}