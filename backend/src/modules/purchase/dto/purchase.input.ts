import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';

@InputType()
export class CreatePurchaseOrderItemInput {
    @Field(() => Int)
    @IsNumber()
    @Min(1)
    productId!: number;

    @Field(() => Int)
    @IsNumber()
    @Min(1)
    quantity!: number;

    @Field(() => Float)
    @IsNumber()
    @Min(0)
    unitPrice!: number;
}

@InputType()
export class CreatePurchaseOrderInput {
    @Field(() => Int)
    @IsNumber()
    supplierId!: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    expectedDeliveryDate?: Date;

    @Field(() => [CreatePurchaseOrderItemInput])
    @IsNotEmpty()
    items!: CreatePurchaseOrderItemInput[];
}

@InputType()
export class UpdatePurchaseOrderInput {
    @Field(() => Int)
    @IsNumber()
    id!: number;

    @Field(() => PurchaseOrderStatus, { nullable: true })
    @IsOptional()
    @IsEnum(PurchaseOrderStatus)
    status?: PurchaseOrderStatus;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    expectedDeliveryDate?: Date;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    receivedDate?: Date;
}

@InputType()
export class CreateSupplierInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    city?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    country?: string;
}

@InputType()
export class UpdateSupplierInput {
    @Field(() => Int)
    @IsNumber()
    id!: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    city?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    country?: string;
}
