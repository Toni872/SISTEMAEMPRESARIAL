import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class InvoicePayment {
    @Field(() => ID)
    id!: number;

    @Field()
    invoiceId!: number;

    @Field()
    amount!: number;

    @Field(() => Date)
    paymentDate!: Date;

    @Field()
    paymentMethod!: string;

    @Field({ nullable: true })
    reference?: string;

    @Field({ nullable: true })
    notes?: string;

    @Field()
    createdBy!: number;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}
