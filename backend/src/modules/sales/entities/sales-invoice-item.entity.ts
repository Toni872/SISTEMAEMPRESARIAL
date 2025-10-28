import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SalesInvoiceItem {
    @Field(() => ID)
    id!: number;

    @Field()
    invoiceId!: number;

    @Field()
    productId!: number;

    @Field({ nullable: true })
    productName?: string;

    @Field({ nullable: true })
    productSku?: string;

    @Field()
    quantity!: number;

    @Field()
    unitPrice!: number;

    @Field()
    discount!: number;

    @Field()
    taxRate!: number;

    @Field()
    taxAmount!: number;

    @Field()
    totalAmount!: number;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}
