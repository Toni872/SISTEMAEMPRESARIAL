import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum SyncTypeEnum {
  PRODUCTS = 'products',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  INVENTORY = 'inventory',
  PRICING = 'pricing',
}

registerEnumType(SyncTypeEnum, {
  name: 'SyncType',
  description: 'Tipo de sincronización',
});

export enum SyncDirectionEnum {
  FROM_EXTERNAL = 'from_external',
  TO_EXTERNAL = 'to_external',
  BIDIRECTIONAL = 'bidirectional',
}

registerEnumType(SyncDirectionEnum, {
  name: 'SyncDirection',
  description: 'Dirección de sincronización',
});

@ObjectType()
export class SyncError {
  @Field({ nullable: true })
  recordId?: string;

  @Field()
  message!: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class SyncResult {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field(() => Int)
  recordsProcessed!: number;

  @Field(() => Int)
  recordsCreated!: number;

  @Field(() => Int)
  recordsUpdated!: number;

  @Field(() => Int)
  recordsFailed!: number;

  @Field(() => [SyncError], { nullable: true })
  errors?: SyncError[];

  @Field(() => Int)
  duration!: number;

  @Field()
  completedAt!: Date;
}

@ObjectType()
export class IntegrationStats {
  @Field(() => Int)
  totalSyncs!: number;

  @Field(() => Int)
  successfulSyncs!: number;

  @Field(() => Int)
  failedSyncs!: number;

  @Field(() => Int, { nullable: true })
  lastSyncDuration?: number;
}

@ObjectType()
export class IntegrationStatus {
  @Field()
  enabled!: boolean;

  @Field()
  connected!: boolean;

  @Field({ nullable: true })
  lastSyncAt?: Date;

  @Field({ nullable: true })
  lastError?: string;

  @Field(() => IntegrationStats, { nullable: true })
  stats?: IntegrationStats;
}

@ObjectType()
export class IntegrationInfo {
  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field()
  version!: string;

  @Field()
  connected!: boolean;

  @Field(() => IntegrationStatus)
  status!: IntegrationStatus;
}
