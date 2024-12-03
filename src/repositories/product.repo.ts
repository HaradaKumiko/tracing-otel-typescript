import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findOne(){
        return this.prisma.product.findFirst()
    }
} 