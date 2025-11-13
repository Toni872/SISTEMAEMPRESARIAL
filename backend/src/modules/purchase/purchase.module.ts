import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseOrdersResolver, SuppliersResolver } from './purchase.resolver';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseService, PurchaseOrdersResolver, SuppliersResolver],
  exports: [PurchaseService],
})
export class PurchaseModule {}
