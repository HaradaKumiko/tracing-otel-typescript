import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from 'src/services/product.service';
import { Response } from 'express';
import opentelemetry from '@opentelemetry/api';

const tracer = opentelemetry.trace.getTracer('express-app');


@Controller('product')
export class ProductController {
    constructor (private productService: ProductService){}

    @Get()
    async findOne(@Res() res: Response) {
    const span = tracer.startSpan('get-product-route');
    span.setAttribute("user_id", "a85faf90-b63b-41ca-ab39-0855969f6ec4")
    span.setAttribute("balance", 800_000_000_000)
    span.end();
     const data = this.productService.findOne()
      return res.status(200).json({
        code: 200,
        status: 'success',
        data: data,
        
      });

    }
}