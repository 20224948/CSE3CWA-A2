export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { ensureDb, Output } from "../../../lib/sequelize";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer('cwa-app');

function printSpan(span: any) {
  if (process.env.NODE_ENV !== 'test' || process.env.SPAN_MUTE === '1') return;

  const tag = process.env.TEST_NAME ? `[${process.env.TEST_NAME}] ` : '';
  const attrs = Object.entries(span?.attributes ?? {})
    .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(', ');

  process.stdout.write(`\n${tag}Span: ${span.name}\n`);
  if (attrs) process.stdout.write(`${tag}Attributes: ${attrs}\n`);
}


export async function GET() {
  await ensureDb();
  return tracer.startActiveSpan('GET /api/outputs', async (span) => {
    try {
      const rows = await Output.findAll({ order: [['id', 'DESC']], limit: 50 });
      span.setAttribute('db.operation', 'findAll');
      span.setAttribute('db.count', rows.length);
      return NextResponse.json(rows, { status: 200 });
    } catch (e: any) {
      span.recordException(e);
      return NextResponse.json({ error: 'Internal' }, { status: 500 });
    } finally {
      printSpan(span);
      span.end();
    }
  });
}

export async function POST(req: Request) {
  await ensureDb();
  return tracer.startActiveSpan('POST /api/outputs', async (span) => {
    try {
      const body = await req.json();
      const created = await Output.create(body);
      span.setAttribute('db.operation', 'create');
      span.setAttribute('output.id', created.id);
      return NextResponse.json(created, { status: 201 });
    } catch (e: any) {
      span.recordException(e);
      return NextResponse.json({ error: 'Internal' }, { status: 500 });
    } finally {
      printSpan(span); 
      span.end();
    }
  });
}
