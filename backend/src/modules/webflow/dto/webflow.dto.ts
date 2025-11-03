import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para items del carrito
@InputType()
export class WebflowCartItemInput {
    @Field()
    @IsNotEmpty()
    productId!: number;

    @Field()
    @IsNotEmpty()
    sku!: string;

    @Field()
    @Min(1)
    quantity!: number;

    @Field()
    unitPrice!: number;

    @Field()
    totalPrice!: number;

    @Field({ nullable: true })
    @IsOptional()
    name?: string;
}

// DTO para datos del cliente de Webflow
@InputType()
export class WebflowCustomerInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field({ nullable: true })
    @IsOptional()
    firstName?: string;

    @Field({ nullable: true })
    @IsOptional()
    lastName?: string;

    @Field({ nullable: true })
    @IsOptional()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    company?: string;

    @Field({ nullable: true })
    @IsOptional()
    taxId?: string;
}

// DTO para dirección de envío
@InputType()
export class WebflowShippingAddressInput {
    @Field()
    @IsNotEmpty()
    address!: string;

    @Field({ nullable: true })
    @IsOptional()
    city?: string;

    @Field({ nullable: true })
    @IsOptional()
    postalCode?: string;

    @Field({ nullable: true })
    @IsOptional()
    country?: string;
}

// DTO principal para crear orden desde Webflow
@InputType()
export class WebflowOrderInput {
    @Field(() => [WebflowCartItemInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WebflowCartItemInput)
    items!: WebflowCartItemInput[];

    @Field(() => WebflowCustomerInput)
    @ValidateNested()
    @Type(() => WebflowCustomerInput)
    customer!: WebflowCustomerInput;

    @Field({ nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => WebflowShippingAddressInput)
    shippingAddress?: WebflowShippingAddressInput;

    @Field()
    subtotal!: number;

    @Field({ nullable: true, defaultValue: 0 })
    @IsOptional()
    discountAmount?: number;

    @Field({ nullable: true, defaultValue: 0 })
    @IsOptional()
    taxAmount?: number;

    @Field()
    totalAmount!: number;

    @Field({ nullable: true })
    @IsOptional()
    webflowOrderId?: string;

    @Field({ nullable: true })
    @IsOptional()
    notes?: string;

    @Field({ nullable: true, defaultValue: 'WEBFLOW' })
    @IsOptional()
    source?: string;
}

// DTO para respuesta de orden creada
@ObjectType()
export class WebflowOrderResponse {
    @Field()
    orderNumber!: string;

    @Field()
    status!: string;

    @Field()
    totalAmount!: number;

    @Field({ nullable: true })
    estimatedDelivery?: Date;

    @Field({ nullable: true })
    message?: string;
}

// DTO para webhook de evento de Webflow
@InputType()
export class WebflowWebhookInput {
    @Field()
    event!: string;

    @Field({ nullable: true })
    orderId?: string;

    @Field({ nullable: true })
    data?: string;
}

// DTO para productos públicos para Webflow
@ObjectType()
export class WebflowPublicProduct {
    @Field()
    id!: number;

    @Field()
    name!: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    sku!: string;

    @Field()
    price!: number;

    @Field()
    stock!: number;

    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    image?: string;
}


