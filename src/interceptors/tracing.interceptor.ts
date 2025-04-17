import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Span, SpanKind, SpanStatusCode, trace, context as otelContext } from '@opentelemetry/api';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tracer = trace.getTracer('nestjs-tracer');
    
    const span = tracer.startSpan(`${request.method} ${request.url}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': request.method,
        'http.url': request.url,
        'http.route': request.route?.path,
      },
    });

    // Create a new context with the span
    const ctx = trace.setSpan(otelContext.active(), span);

    // Add the span to the request object
    request.span = span;

    return otelContext.with(ctx, () => {
      return next.handle().pipe(
        tap({
          next: () => {
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
          },
          error: (error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            span.recordException(error);
            span.end();
          },
        }),
      );
    });
  }
} 