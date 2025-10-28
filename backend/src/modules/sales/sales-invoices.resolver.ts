import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesInvoice, InvoiceStatus, PaymentStatus } from './entities/sales-invoice.entity';
import { InvoicePayment } from './entities/invoice-payment.entity';
import {
    CreateSalesInvoiceInput,
    UpdateSalesInvoiceInput,
    RecordPaymentInput,
} from './dto/sales-invoice.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => SalesInvoice)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesInvoicesResolver {
    constructor(private readonly salesService: SalesService) { }

    @Mutation(() => SalesInvoice)
    @Roles('ADMIN', 'MANAGER', 'USER')
    createSalesInvoice(
        @Args('createSalesInvoiceInput') createSalesInvoiceInput: CreateSalesInvoiceInput,
        @CurrentUser() user: any,
    ) {
        return this.salesService.createSalesInvoice(createSalesInvoiceInput, user.userId);
    }

    @Query(() => [SalesInvoice], { name: 'salesInvoices' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findAllSalesInvoices(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
        @Args('status', { type: () => InvoiceStatus, nullable: true }) status?: InvoiceStatus,
        @Args('paymentStatus', { type: () => PaymentStatus, nullable: true }) paymentStatus?: PaymentStatus,
    ) {
        return this.salesService.findAllSalesInvoices(skip, take, status, paymentStatus);
    }

    @Query(() => SalesInvoice, { name: 'salesInvoice' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    findOneSalesInvoice(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.findOneSalesInvoice(id);
    }

    @Mutation(() => SalesInvoice)
    @Roles('ADMIN', 'MANAGER')
    updateSalesInvoice(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateSalesInvoiceInput') updateSalesInvoiceInput: UpdateSalesInvoiceInput,
    ) {
        return this.salesService.updateSalesInvoice(id, updateSalesInvoiceInput);
    }

    @Mutation(() => SalesInvoice)
    @Roles('ADMIN', 'MANAGER')
    submitSalesInvoice(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.submitSalesInvoice(id);
    }

    @Mutation(() => SalesInvoice)
    @Roles('ADMIN', 'MANAGER')
    cancelSalesInvoice(@Args('id', { type: () => Int }) id: number) {
        return this.salesService.cancelSalesInvoice(id);
    }

    @Mutation(() => InvoicePayment)
    @Roles('ADMIN', 'MANAGER', 'USER')
    recordInvoicePayment(
        @Args('recordPaymentInput') recordPaymentInput: RecordPaymentInput,
        @CurrentUser() user: any,
    ) {
        return this.salesService.createInvoicePayment(
            recordPaymentInput.invoiceId,
            recordPaymentInput,
            user.userId,
        );
    }

    @Query(() => [InvoicePayment], { name: 'invoicePayments' })
    @Roles('ADMIN', 'MANAGER', 'USER')
    getInvoicePayments(@Args('invoiceId', { type: () => Int }) invoiceId: number) {
        return this.salesService.getInvoicePayments(invoiceId);
    }

    @Mutation(() => Boolean)
    @Roles('ADMIN', 'MANAGER')
    deleteInvoicePayment(
        @Args('paymentId', { type: () => Int }) paymentId: number,
        @CurrentUser() user: any,
    ) {
        return this.salesService.deleteInvoicePayment(paymentId, user.userId);
    }
}
