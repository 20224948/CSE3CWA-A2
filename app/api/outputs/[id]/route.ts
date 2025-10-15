export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { ensureDb, Output } from "../../../../lib/sequelize";

export async function GET(_req: Request, { params }: any) {
  await ensureDb();
  const row = await Output.findByPk(params.id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: any) {
  await ensureDb();
  const updates = await req.json();
  const row = await Output.findByPk(params.id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await row.update({ title: updates.title ?? row.title, html: updates.html ?? row.html });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: any) {
  await ensureDb();
  const row = await Output.findByPk(params.id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await row.destroy();
  return NextResponse.json({ ok: true }, { status: 204 });
}