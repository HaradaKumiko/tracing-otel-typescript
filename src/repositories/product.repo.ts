import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Product } from '@prisma/client';
import { shouldThrowError } from 'src/utils/error.config';
import { Span, SpanKind, SpanStatusCode, trace, context } from '@opentelemetry/api';

@Injectable()
export class ProductRepository {
    private readonly tracer = trace.getTracer('product-repository');

    constructor(private readonly prisma: PrismaService) { }

    async findAll(parentSpan: Span): Promise<Product[]> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductRepository.findAll', {
            kind: SpanKind.INTERNAL,
            attributes: { 'repository.name': 'product-repository' }
        }, ctx);
        if (shouldThrowError()) {
            throw new HttpException('Random repository error: Failed to fetch products', 500);
        }
        try {
            const products = await this.prisma.product.findMany();
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
        const span = this.tracer.startSpan('ProductRepository.findOne', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'repository.name': 'product-repository',
                'product.id': id 
            }
        }, ctx);
        if (shouldThrowError()) {
            throw new HttpException('Random repository error: Failed to fetch product', 500);
        }
        try {
            const product = await this.prisma.product.findUnique({
                where: { id }
            });
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
        const span = this.tracer.startSpan('ProductRepository.create', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'repository.name': 'product-repository',
                'product.name': data.name,
                'product.price': data.price 
            }
        }, ctx);
        if (shouldThrowError()) {
            throw new HttpException('Random repository error: Failed to create product', 500);
        }
        try {
            const product = await this.prisma.product.create({
                data
            });
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

    async update(id: string, data: { name?: string; price?: number; description?: string }, parentSpan: Span): Promise<Product> {
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductRepository.update', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'repository.name': 'product-repository',
                'product.id': id 
            }
        }, ctx);
        if (shouldThrowError()) {
            throw new HttpException('Random repository error: Failed to update product', 500);
        }
        try {
            const product = await this.prisma.product.update({
                where: { id },
                data
            });
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
        const span = this.tracer.startSpan('ProductRepository.delete', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'repository.name': 'product-repository',
                'product.id': id 
            }
        }, ctx);
        if (shouldThrowError()) {
            throw new HttpException('Random repository error: Failed to delete product', 500);
        }
        try {
            const product = await this.prisma.product.delete({
                where: { id }
            });
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
} 