import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesOrder, Customer, OrderStatus } from './entities/sales-order.entity';
import {
    CreateSalesOrderInput,
    UpdateSalesOrderInput,
    CreateCustomerInput,
    UpdateCustomerInput,
} from './dto/sales.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => SalesOrder)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesOrdersResolver {
    constructor(private readonly salesService: SalesService) { }

    @Mutation(() => SalesOrder)
    @Roles('ADMIN', 'MANAGER', 'USER')
    createSalesOrder(
        @Args('createSalesOrderInput') createSalesOrderInput: CreateSalesOrderInput,
        @CurrentUser() user: any,
    ) {
        return this.salesService.createSalesOrder(createSalesOrderInput, user.userId);
    }

    @Query(() => [SalesOrder], { name: 'salesOrders' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAllSalesOrders(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
        @Args('status', { type: () => OrderStatus, nullable: true }) status?: OrderStatus,
    ) {
        return this.salesService.findAllSalesOrders(skip, take, status);
    }

    @Query(() => SalesOrder, { name: 'salesOrder' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findOneSalesOrder(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.findOneSalesOrder(id);
    }

    @Mutation(() => SalesOrder)
    @Roles('ADMIN', 'MANAGER')
    updateSalesOrder(@Args('updateSalesOrderInput') updateSalesOrderInput: UpdateSalesOrderInput) {
        return this.salesService.updateSalesOrder(updateSalesOrderInput);
    }

    @Mutation(() => SalesOrder)
    @Roles('ADMIN', 'MANAGER')
    cancelSalesOrder(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.cancelSalesOrder(id);
    }
}

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersResolver {
    constructor(private readonly salesService: SalesService) { }

    @Mutation(() => Customer)
    @Roles('ADMIN', 'MANAGER')
    createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput) {
        return this.salesService.createCustomer(createCustomerInput);
    }

    @Query(() => [Customer], { name: 'customers' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAllCustomers(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
        @Args('search', { nullable: true }) search?: string,
    ) {
        return this.salesService.findAllCustomers(skip, take, search);
    }

    @Query(() => Customer, { name: 'customer' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findOneCustomer(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.findOneCustomer(id);
    }

    @Mutation(() => Customer)
    @Roles('ADMIN', 'MANAGER')
    updateCustomer(@Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput) {
        return this.salesService.updateCustomer(updateCustomerInput);
    }

    @Mutation(() => Customer)
    @Roles('ADMIN')
    removeCustomer(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.removeCustomer(id);
    }
}
