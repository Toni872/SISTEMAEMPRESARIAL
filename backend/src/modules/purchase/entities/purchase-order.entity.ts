import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql';

export enum PurchaseOrderStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED',
}

registerEnumType(PurchaseOrderStatus, {
    name: 'PurchaseOrderStatus',
    description: 'Estado de la orden de compra',
});

@ObjectType()
export class PurchaseOrderItem {
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
    totalPrice!: number;

    @Field(() => Date)
    createdAt!: Date;
}

@ObjectType()
export class PurchaseOrder {
    @Field(() => Int)
    id!: number;

    @Field(() => String)
    orderNumber!: string;

    @Field(() => Int)
    supplierId!: number;

    @Field(() => String, { nullable: true })
    supplierName?: string;

    @Field(() => Int, { nullable: true })
    userId?: number;

    @Field(() => String, { nullable: true })
    userName?: string;

    @Field(() => PurchaseOrderStatus)
    status!: PurchaseOrderStatus;

    @Field(() => Float)
    subtotal!: number;

    @Field(() => Float)
    taxAmount!: number;

    @Field(() => Float)
    totalAmount!: number;

    @Field(() => String, { nullable: true })
    notes?: string;

    @Field(() => Date)
    orderDate!: Date;

    @Field(() => Date, { nullable: true })
    expectedDeliveryDate?: Date;

    @Field(() => Date, { nullable: true })
    receivedDate?: Date;

    @Field(() => [PurchaseOrderItem], { nullable: true })
    items?: PurchaseOrderItem[];

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}

@ObjectType()
export class Supplier {
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
