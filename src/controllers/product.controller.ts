import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from 'src/services/product.service';
import { Response } from 'express';
import { trace } from '@opentelemetry/api';



@Controller('product')
export class ProductController {
  private readonly tracer = trace.getTracer('product-controller');
  constructor (private productService: ProductService){}

    @Get()
    async findOne(@Res() res: Response) {
    const span = this.tracer.startSpan('get-product-route');
    span.setAttribute("user_id", "a85faf90-b63b-41ca-ab39-0855969f6ec4")
    span.setAttribute("balance", 800_000_000_000)
    span.end();
     const data = this.productService.findOne(span)
      return res.status(200).json({
        code: 200,
        status: 'success',
        data: data,
        
      });

    }
}