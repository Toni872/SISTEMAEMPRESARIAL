import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingResolver } from './accounting.resolver';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AccountingService, AccountingResolver],
    exports: [AccountingService],
})
export class AccountingModule { }