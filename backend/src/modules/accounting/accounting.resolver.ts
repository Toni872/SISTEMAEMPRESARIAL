import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import {
    FinancialSummary,
    MonthlySales,
    TopProduct,
    InventoryValue,
} from './entities/accounting.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingResolver {
    constructor(private readonly accountingService: AccountingService) { }

    @Query(() => FinancialSummary, { name: 'financialSummary' })
    @Roles('ADMIN', 'MANAGER')
    getFinancialSummary(
        @Args('startDate', { nullable: true }) startDate?: Date,
        @Args('endDate', { nullable: true }) endDate?: Date,
    ) {
        return this.accountingService.getFinancialSummary(startDate, endDate);
    }

    @Query(() => [MonthlySales], { name: 'monthlySales' })
    @Roles('ADMIN', 'MANAGER')
    getMonthlySales(@Args('year', { type: () => Int }) year: number) {
        return this.accountingService.getMonthlySales(year);
    }

    @Query(() => [TopProduct], { name: 'topProducts' })
    @Roles('ADMIN', 'MANAGER')
    getTopProducts(@Args('limit', { type: () => Int, defaultValue: 10 }) limit: number) {
        return this.accountingService.getTopProducts(limit);
    }

    @Query(() => InventoryValue, { name: 'inventoryValue' })
    @Roles('ADMIN', 'MANAGER')
    getInventoryValue() {
        return this.accountingService.getInventoryValue();
    }
}
