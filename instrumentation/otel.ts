// instrumentation/otel.ts
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  SimpleSpanProcessor,
  SpanExporter,
  ReadableSpan,
} from '@opentelemetry/sdk-trace-base';

// fallback-safe success constant
const SUCCESS_CODE = 0;

let initialised = false;

/** Pretty, assignment-friendly console output for spans */
class PrettyConsoleExporter implements SpanExporter {
  export(spans: ReadableSpan[], cb: (r: { code: number }) => void): void {
    for (const span of spans) {
      const attrs = Object.entries(span.attributes ?? {})
        .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
        .join(', ');
      console.log(`\nSpan: ${span.name}`);
      if (attrs) console.log(`  attributes: ${attrs}`);
    }
    cb({ code: SUCCESS_CODE });
  }
  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}

export function initOtel() {
  if (initialised) return trace.getTracer('cwa-app');

  const provider: any = new NodeTracerProvider();

  if (typeof provider.addSpanProcessor === 'function') {
    provider.addSpanProcessor(new SimpleSpanProcessor(new PrettyConsoleExporter()));
  }
  if (typeof provider.register === 'function') {
    provider.register();
  }

  initialised = true;
  return trace.getTracer('cwa-app');
}
