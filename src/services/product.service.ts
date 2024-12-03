import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/repositories/product.repo';
import { Span, context, trace } from '@opentelemetry/api';

@Injectable()
export class ProductService {
private readonly tracer = trace.getTracer('product-service');
  constructor(private readonly productRepo: ProductRepository) {}

  async findOne(parentSpan: Span) {

    return context.with(trace.setSpan(context.active(), parentSpan), async () => {
        const span = this.tracer.startSpan('product-service', {
          attributes: {
            'service.method': 'findOne',
          },
        });

        span.addEvent("call another service")
        await this.callAnotherService()

      try {
        const result = await this.productRepo.findOne();

        span.setAttribute('product.count', result ? 1 : 0);

        return result;
      } catch (error) {
        span.recordException(error); 
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async callAnotherService(){
    setTimeout(() => {
        // Code to execute after the delay
        console.log("Service called after 30 seconds");
      }, 39_000);  }
}
