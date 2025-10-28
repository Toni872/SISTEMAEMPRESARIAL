import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { ProductsController } from './products.controller';

@Module({
    controllers: [ProductsController],
    providers: [ProductsResolver, ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }