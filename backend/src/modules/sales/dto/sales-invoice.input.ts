import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class SalesInvoiceItemInput {
    @Field()
    @IsNumber()
    @IsNotEmpty()
    productId!: number;

    @Field()
    @IsNumber()
    @Min(0.01)
    quantity!: number;

    @Field()
    @IsNumber()
    @Min(0)
    unitPrice!: number;

    @Field({ nullable: true, defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    discount?: number;

    @Field({ nullable: true, defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    taxRate?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;
}

@InputType()
export class CreateSalesInvoiceInput {
    @Field()
    @IsNumber()
    @IsNotEmpty()
    customerId!: number;

    @Field({ nullable: true })
    @IsNumber()
    @IsOptional()
    salesOrderId?: number;

    @Field()
    @IsNotEmpty()
    invoiceDate!: Date;

    @Field()
    @IsNotEmpty()
    dueDate!: Date;

    @Field({ nullable: true, defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    discountAmount?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    currency?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    paymentTerms?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    notes?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @Field(() => [SalesInvoiceItemInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SalesInvoiceItemInput)
    items!: SalesInvoiceItemInput[];
}

@InputType()
export class UpdateSalesInvoiceInput {
    @Field()
    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @Field({ nullable: true })
    @IsNumber()
    @IsOptional()
    customerId?: number;

    @Field({ nullable: true })
    @IsOptional()
    invoiceDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    dueDate?: Date;

    @Field({ nullable: true })
    @IsNumber()
    @IsOptional()
    discountAmount?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    currency?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    paymentTerms?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    notes?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @Field(() => [SalesInvoiceItemInput], { nullable: true })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SalesInvoiceItemInput)
    items?: SalesInvoiceItemInput[];
}

@InputType()
export class RecordPaymentInput {
    @Field()
    @IsNumber()
    @IsNotEmpty()
    invoiceId!: number;

    @Field()
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @Field()
    @IsNotEmpty()
    paymentDate!: Date;

    @Field({ nullable: true, defaultValue: 'CASH' })
    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    reference?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    notes?: string;
}
