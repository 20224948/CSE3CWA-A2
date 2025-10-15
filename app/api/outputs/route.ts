export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { ensureDb, Output } from "../../../lib/sequelize";

export async function GET() {
  await ensureDb();  // ensure model & connection
  const items = await Output.findAll({ order: [['createdAt', 'DESC']] });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.title || !body?.html) {
    return NextResponse.json({ error: 'Title and HTML required' }, { status: 400 });
  }
  await ensureDb();  // ✅
  const item = await Output.create({ title: body.title, html: body.html });
  return NextResponse.json(item, { status: 201 });
}