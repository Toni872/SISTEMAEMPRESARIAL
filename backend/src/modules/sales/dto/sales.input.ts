import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/sales-order.entity';

@InputType()
export class CreateSalesOrderItemInput {
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
export class CreateSalesOrderInput {
  @Field(() => Int)
  @IsNumber()
  customerId!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deliveryDate?: Date;

  @Field(() => [CreateSalesOrderItemInput])
  @IsNotEmpty()
  items!: CreateSalesOrderItemInput[];
}

@InputType()
export class UpdateSalesOrderInput {
  @Field(() => Int)
  @IsNumber()
  id!: number;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deliveryDate?: Date;
}

@InputType()
export class CreateCustomerInput {
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
export class UpdateCustomerInput {
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
