import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const className = formData.get('className') as string;

    if (!file || !className) {
      return NextResponse.json({ error: 'Missing file or class name' }, { status: 400 });
    }

    // Convert file to buffer and read it with XLSX
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Create the Class if it doesn't exist
    const classRoom = await prisma.classRoom.upsert({
      where: { name: className },
      update: {},
      create: { name: className },
    });

    // Insert students from the Excel rows
    let addedCount = 0;
    for (const row of rows) {
      // Look for columns exactly named 'studentId' and 'name'
      if (row.studentId && row.name) {
        await prisma.student.upsert({
          where: { studentId: String(row.studentId) },
          update: { name: String(row.name), classRoomId: classRoom.id },
          create: {
            studentId: String(row.studentId),
            name: String(row.name),
            classRoomId: classRoom.id,
          },
        });
        addedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Successfully added ${addedCount} students to ${className}!` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}