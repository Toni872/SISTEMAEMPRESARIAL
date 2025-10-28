import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseOrder, Supplier, PurchaseOrderStatus } from './entities/purchase-order.entity';
import {
    CreatePurchaseOrderInput,
    UpdatePurchaseOrderInput,
    CreateSupplierInput,
    UpdateSupplierInput,
} from './dto/purchase.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => PurchaseOrder)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrdersResolver {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Mutation(() => PurchaseOrder)
    @Roles('ADMIN', 'MANAGER')
    createPurchaseOrder(
        @Args('createPurchaseOrderInput') createPurchaseOrderInput: CreatePurchaseOrderInput,
        @CurrentUser() user: any,
    ) {
        return this.purchaseService.createPurchaseOrder(createPurchaseOrderInput, user.userId);
    }

    @Query(() => [PurchaseOrder], { name: 'purchaseOrders' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAllPurchaseOrders(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
        @Args('status', { type: () => PurchaseOrderStatus, nullable: true }) status?: PurchaseOrderStatus,
    ) {
        return this.purchaseService.findAllPurchaseOrders(skip, take, status);
    }

    @Query(() => PurchaseOrder, { name: 'purchaseOrder' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findOnePurchaseOrder(@Args('id', { type: () => Int }) id: number) {
        return this.purchaseService.findOnePurchaseOrder(id);
    }

    @Mutation(() => PurchaseOrder)
    @Roles('ADMIN', 'MANAGER')
    updatePurchaseOrder(@Args('updatePurchaseOrderInput') updatePurchaseOrderInput: UpdatePurchaseOrderInput) {
        return this.purchaseService.updatePurchaseOrder(updatePurchaseOrderInput);
    }

    @Mutation(() => PurchaseOrder)
    @Roles('ADMIN', 'MANAGER')
    receivePurchaseOrder(@Args('id', { type: () => Int }) id: number) {
        return this.purchaseService.receivePurchaseOrder(id);
    }

    @Mutation(() => PurchaseOrder)
    @Roles('ADMIN', 'MANAGER')
    cancelPurchaseOrder(@Args('id', { type: () => Int }) id: number) {
        return this.purchaseService.cancelPurchaseOrder(id);
    }
}

@Resolver(() => Supplier)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersResolver {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Mutation(() => Supplier)
    @Roles('ADMIN', 'MANAGER')
    createSupplier(@Args('createSupplierInput') createSupplierInput: CreateSupplierInput) {
        return this.purchaseService.createSupplier(createSupplierInput);
    }

    @Query(() => [Supplier], { name: 'suppliers' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAllSuppliers(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
        @Args('search', { nullable: true }) search?: string,
    ) {
        return this.purchaseService.findAllSuppliers(skip, take, search);
    }

    @Query(() => Supplier, { name: 'supplier' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findOneSupplier(@Args('id', { type: () => Int }) id: number) {
        return this.purchaseService.findOneSupplier(id);
    }

    @Mutation(() => Supplier)
    @Roles('ADMIN', 'MANAGER')
    updateSupplier(@Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput) {
        return this.purchaseService.updateSupplier(updateSupplierInput);
    }

    @Mutation(() => Supplier)
    @Roles('ADMIN')
    removeSupplier(@Args('id', { type: () => Int }) id: number) {
        return this.purchaseService.removeSupplier(id);
    }
}
