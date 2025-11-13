import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class AIModelsMetric {
  @Field(() => Int)
  active!: number;

  @Field(() => Int)
  training!: number;

  @Field(() => Int)
  maintenance!: number;

  @Field(() => Int)
  needsImprovement!: number;
}

@ObjectType()
export class ROIMetric {
  @Field(() => Float)
  percentage!: number;

  @Field(() => Float)
  operationalSavings!: number;

  @Field(() => Float)
  revenueIncrease!: number;
}

@ObjectType()
export class DashboardMetrics {
  @Field(() => Float)
  operationalEfficiency!: number;

  @Field(() => Float, { nullable: true })
  operationalEfficiencyTrend?: number;

  @Field(() => AIModelsMetric)
  aiModels!: AIModelsMetric;

  @Field(() => Float)
  processAutomation!: number;

  @Field(() => Float, { nullable: true })
  processAutomationTrend?: number;

  @Field(() => Float)
  timeReduction!: number;

  @Field(() => ROIMetric)
  roi!: ROIMetric;
}

@ObjectType()
export class PerformancePoint {
  @Field()
  month!: string;

  @Field(() => Float)
  efficiency!: number;

  @Field(() => Float)
  automation!: number;

  @Field(() => Float)
  sales!: number;
}

@ObjectType()
export class ModuleStatus {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  status!: string; // 'operational' | 'warning' | 'error'

  @Field(() => Float)
  uptime!: number;

  @Field()
  icon!: string;

  @Field()
  color!: string;
}
