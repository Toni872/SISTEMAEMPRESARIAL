import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AIModelInfo {
  @Field()
  name!: string;

  @Field()
  status!: string;

  @Field()
  version!: string;

  @Field(() => Float, { nullable: true })
  accuracy?: number;
}

@ObjectType()
export class ActiveAIModels {
  @Field(() => Int)
  total_models!: number;

  @Field(() => Int)
  operational!: number;

  @Field(() => Int)
  training!: number;

  @Field(() => Int)
  maintenance!: number;

  @Field(() => [AIModelInfo], { nullable: true })
  models?: AIModelInfo[];
}

@ObjectType()
export class PredictDemandResult {
  @Field(() => Int)
  product_id!: number;

  @Field(() => Int)
  predicted_units!: number;

  @Field(() => Int)
  days!: number;

  @Field(() => Float)
  confidence!: number;

  @Field(() => [String], { nullable: true })
  recommendations?: string[];

  @Field()
  model_version!: string;
}

@ObjectType()
export class OptimizePriceResult {
  @Field(() => Float)
  optimal_price!: number;

  @Field(() => Float)
  price_change_percentage!: number;

  @Field(() => Float)
  expected_revenue_increase!: number;

  @Field()
  model_version!: string;
}

@ObjectType()
export class AIMetricPoint {
  @Field()
  ts!: string;
  @Field(() => Float)
  accuracy!: number;
  @Field(() => Float)
  latencyMsP95!: number;
  @Field(() => Float)
  latencyMsP99!: number;
  @Field(() => Float)
  throughputRps!: number;
  @Field(() => Float)
  errorRate!: number;
}

@ObjectType()
export class AIMetricsOverall {
  @Field(() => Float)
  throughputRps!: number;
  @Field(() => Float)
  latencyMsP95!: number;
  @Field(() => Float)
  latencyMsP99!: number;
  @Field(() => Float)
  errorRate!: number;
}

@ObjectType()
export class RecentPrediction {
  @Field()
  id!: string;
  @Field(() => Int)
  productId!: number;
  @Field(() => Int)
  units!: number;
  @Field(() => Float)
  confidence!: number;
  @Field()
  ts!: string;
}

@ObjectType()
export class RecentOptimization {
  @Field()
  id!: string;
  @Field(() => Int)
  productId!: number;
  @Field(() => Float)
  optimalPrice!: number;
  @Field(() => Float)
  deltaPct!: number;
  @Field()
  ts!: string;
}

@ObjectType()
export class AIMetrics {
  @Field(() => AIMetricsOverall)
  overall!: AIMetricsOverall;
  @Field(() => [AIMetricPoint])
  series!: AIMetricPoint[];
  @Field(() => [RecentPrediction], { nullable: true })
  recentPredictions?: RecentPrediction[];
  @Field(() => [RecentOptimization], { nullable: true })
  recentOptimizations?: RecentOptimization[];
}

@ObjectType()
export class DeployModelResult {
  @Field()
  success!: boolean;
  @Field()
  message!: string;
}


