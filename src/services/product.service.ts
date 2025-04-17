import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { ProductRepository } from 'src/repositories/product.repo';
import { Span, context, trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { Product } from '@prisma/client';
import { shouldThrowError } from 'src/utils/error.config';

@Injectable()
export class ProductService {
    private readonly tracer = trace.getTracer('product-service');

    constructor(private readonly productRepo: ProductRepository) {}

    async findAll(parentSpan: Span): Promise<Product[]> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductService.findAll', {
            kind: SpanKind.INTERNAL,
            attributes: { 'service.name': 'product-service' }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random service error: Failed to process fetch', 500);
            }
            const products = await context.with(trace.setSpan(context.active(), span), () => 
                this.productRepo.findAll(span)
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return products;
        } catch (error) {
            span.setStatus({ 
                code: SpanStatusCode.ERROR,
                message: error.message 
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async findOne(id: string, parentSpan: Span): Promise<Product | null> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductService.findOne', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'service.name': 'product-service',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random service error: Failed to process fetch', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productRepo.findOne(id, span)
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return product;
        } catch (error) {
            span.setStatus({ 
                code: SpanStatusCode.ERROR,
                message: error.message 
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async create(data: { name: string; price: number; description: string }, parentSpan: Span): Promise<Product> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductService.create', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'service.name': 'product-service',
                'product.name': data.name,
                'product.price': data.price 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random service error: Failed to process create', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productRepo.create(data, span)
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return product;
        } catch (error) {
            span.setStatus({ 
                code: SpanStatusCode.ERROR,
                message: error.message 
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async update(id: string, data: Partial<Product>, parentSpan: Span): Promise<Product> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductService.update', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'service.name': 'product-service',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random service error: Failed to process update', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productRepo.update(id, data, span)
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return product;
        } catch (error) {
            span.setStatus({ 
                code: SpanStatusCode.ERROR,
                message: error.message 
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async delete(id: string, parentSpan: Span): Promise<Product> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductService.delete', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'service.name': 'product-service',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random service error: Failed to process delete', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productRepo.delete(id, span)
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return product;
        } catch (error) {
            span.setStatus({ 
                code: SpanStatusCode.ERROR,
                message: error.message 
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async callAnotherService() {
        setTimeout(() => {
            console.log("Service called after 30 seconds");
        }, 39_000);
    }
}
