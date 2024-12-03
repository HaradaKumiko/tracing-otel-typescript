import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/repositories/product.repo';
import opentelemetry from '@opentelemetry/api';

@Injectable()
export class ProductService {
    private readonly tracer = opentelemetry.trace.getTracer('product-service');

    constructor(private readonly productRepo: ProductRepository) { }

    async findOne() {
        return opentelemetry.context.with(
            opentelemetry.context.active(),
            async () => {
                const span = this.tracer.startSpan('findOne');
                
                try {
                    span.setAttribute('service.method', 'findOne');
                    
                    const result = await this.productRepo.findOne();
                    
                    span.setAttribute('product.count', result ? 1 : 0);
                    
                    return result;
                } catch (error) {
                    span.recordException(error);
                    throw error;
                } finally {
                    span.end();
                }
            }
        );
    }
} 