import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Product {
    @Field(() => Int)
    id!: number;

    @Field()
    name!: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    sku!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => Float, { nullable: true })
    cost?: number;

    @Field(() => Int)
    stock!: number;

    @Field(() => Int)
    minStock!: number;

    @Field(() => Int, { nullable: true })
    maxStock?: number;

    @Field({ nullable: true })
    category?: string;

    @Field()
    isActive!: boolean;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}