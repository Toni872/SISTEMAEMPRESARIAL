import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class FinancialSummary {
  @Field(() => Float)
  totalSales!: number;

  @Field(() => Float)
  totalPurchases!: number;

  @Field(() => Float)
  netProfit!: number;

  @Field(() => Float)
  profitMargin!: number;

  @Field(() => Int)
  totalOrders!: number;

  @Field(() => Int)
  pendingOrders!: number;
}

@ObjectType()
export class MonthlySales {
  @Field(() => String)
  month!: string;

  @Field(() => Float)
  total!: number;

  @Field(() => Int)
  orderCount!: number;
}

@ObjectType()
export class TopProduct {
  @Field(() => Int)
  productId!: number;

  @Field(() => String)
  productName!: string;

  @Field(() => Int)
  totalQuantity!: number;

  @Field(() => Float)
  totalRevenue!: number;
}

@ObjectType()
export class InventoryValue {
  @Field(() => Float)
  totalValue!: number;

  @Field(() => Int)
  totalProducts!: number;

  @Field(() => Int)
  lowStockProducts!: number;

  @Field(() => Int)
  outOfStockProducts!: number;
}
