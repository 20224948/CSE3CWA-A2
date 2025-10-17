export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { ensureDb, Output } from "../../../../lib/sequelize";
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



export async function GET(_req: Request, { params }: any) {
  return tracer.startActiveSpan('GET /api/outputs/:id', async (span) => {
    try {
      await ensureDb();
      const id = Number(params?.id);
      span.setAttribute('output.id', id);

      const row = await Output.findByPk(id);
      if (!row) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(row, { status: 200 });
    } catch (e: any) {
      span.recordException(e);
      return NextResponse.json({ error: 'Internal' }, { status: 500 });
    } finally {
      span.end();
    }
  });
}
