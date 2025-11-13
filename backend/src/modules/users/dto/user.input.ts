import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Role } from '../../auth/dto/auth.dto';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field(() => Role, { defaultValue: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class ChangeUserPasswordInput {
  @Field(() => Int)
  id!: number;

  @Field()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @IsString()
  newPassword!: string;
}
