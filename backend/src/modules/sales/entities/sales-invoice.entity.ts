import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { SalesInvoiceItem } from './sales-invoice-item.entity';
import { InvoicePayment } from './invoice-payment.entity';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
}

registerEnumType(InvoiceStatus, {
  name: 'InvoiceStatus',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
export class SalesInvoice {
  @Field(() => ID)
  id!: number;

  @Field()
  invoiceNumber!: string;

  @Field()
  customerId!: number;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  salesOrderId?: number;

  @Field({ nullable: true })
  salesOrderNumber?: string;

  @Field(() => Date)
  invoiceDate!: Date;

  @Field(() => Date)
  dueDate!: Date;

  @Field(() => InvoiceStatus)
  status!: InvoiceStatus;

  @Field(() => PaymentStatus)
  paymentStatus!: PaymentStatus;

  @Field()
  subtotal!: number;

  @Field()
  taxRate!: number;

  @Field()
  taxAmount!: number;

  @Field()
  discountAmount!: number;

  @Field()
  total!: number;

  @Field()
  paidAmount!: number;

  @Field()
  outstandingAmount!: number;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  paymentTerms?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  termsAndConditions?: string;

  @Field(() => [SalesInvoiceItem], { nullable: true })
  items?: SalesInvoiceItem[];

  @Field(() => [InvoicePayment], { nullable: true })
  payments?: InvoicePayment[];

  @Field()
  createdBy!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;
}
