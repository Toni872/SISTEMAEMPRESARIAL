import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesOrdersResolver, CustomersResolver } from './sales.resolver';
import { SalesInvoicesResolver } from './sales-invoices.resolver';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [SalesService, SalesOrdersResolver, CustomersResolver, SalesInvoicesResolver],
    exports: [SalesService],
})
export class SalesModule { }