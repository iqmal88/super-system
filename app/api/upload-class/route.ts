import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const className = formData.get('className') as string;
    const formName = formData.get('form') as string;

    if (!file || !className || !formName) {
      return NextResponse.json({ error: 'Missing file, form, or class name' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Create the Class with the Form assigned
    const classRoom = await prisma.classRoom.upsert({
      where: { name: className },
      update: { form: formName },
      create: { name: className, form: formName },
    });

    let addedCount = 0;
    for (const row of rows) {
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

    return NextResponse.json({ success: true, message: `Successfully added ${addedCount} students to ${formName} ${className}!` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}