import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Activity {
    @Field(() => Int)
    id!: number;

    @Field()
    type!: string; // 'sale' | 'purchase' | 'inventory' | 'user' | 'system'

    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    timestamp!: Date;

    @Field({ nullable: true })
    userId?: number;

    @Field({ nullable: true })
    userName?: string;

    @Field({ nullable: true })
    icon?: string;

    @Field({ nullable: true })
    color?: string;
}

@ObjectType()
export class ActivityFeed {
    @Field(() => [Activity])
    activities!: Activity[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    unread!: number;
}
