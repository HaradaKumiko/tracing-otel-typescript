import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req } from '@nestjs/common';
import { ProductService } from 'src/services/product.service';
import { Product } from '@prisma/client';
import { shouldThrowError } from 'src/utils/error.config';
import { Span, SpanKind, SpanStatusCode, trace, context } from '@opentelemetry/api';

@Controller('products')
export class ProductController {
    private readonly tracer = trace.getTracer('product-controller');

    constructor(private readonly productService: ProductService) {}

    @Get()
    async findAll(@Req() req: any): Promise<Product[]> {
        const parentSpan = req.span;
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductController.findAll', {
            kind: SpanKind.INTERNAL,
            attributes: { 'controller.name': 'product-controller' }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random controller error: Failed to handle fetch request', 500);
            }
            const products = await context.with(trace.setSpan(context.active(), span), () => 
                this.productService.findAll(span)
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

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any): Promise<Product | null> {
        const parentSpan = req.span;
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductController.findOne', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'controller.name': 'product-controller',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random controller error: Failed to handle fetch request', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productService.findOne(id, span)
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

    @Post()
    async create(@Body() data: { name: string; price: number; description: string }, @Req() req: any): Promise<Product> {
        const parentSpan = req.span;
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductController.create', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'controller.name': 'product-controller',
                'product.name': data.name,
                'product.price': data.price 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random controller error: Failed to handle create request', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productService.create(data, span)
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

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: Partial<Product>,
        @Req() req: any
    ): Promise<Product> {
        const parentSpan = req.span;
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductController.update', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'controller.name': 'product-controller',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random controller error: Failed to handle update request', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productService.update(id, data, span)
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

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any): Promise<Product> {
        const parentSpan = req.span;
        const ctx = trace.setSpan(context.active(), parentSpan);
        const span = this.tracer.startSpan('ProductController.delete', {
            kind: SpanKind.INTERNAL,
            attributes: { 
                'controller.name': 'product-controller',
                'product.id': id 
            }
        }, ctx);

        try {
            if (shouldThrowError()) {
                throw new HttpException('Random controller error: Failed to handle delete request', 500);
            }
            const product = await context.with(trace.setSpan(context.active(), span), () => 
                this.productService.delete(id, span)
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
}