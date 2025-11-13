import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Estado de la orden de venta',
});

@ObjectType()
export class SalesOrderItem {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  productId!: number;

  @Field(() => String)
  productName!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  unitPrice!: number;

  @Field(() => Float)
  subtotal!: number;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
export class SalesOrder {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  orderNumber!: string;

  @Field(() => Int)
  customerId!: number;

  @Field(() => String, { nullable: true })
  customerName?: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => String, { nullable: true })
  userName?: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field(() => Float)
  totalAmount!: number;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date)
  orderDate!: Date;

  @Field(() => Date, { nullable: true })
  deliveryDate?: Date;

  @Field(() => [SalesOrderItem], { nullable: true })
  items?: SalesOrderItem[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class Customer {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
