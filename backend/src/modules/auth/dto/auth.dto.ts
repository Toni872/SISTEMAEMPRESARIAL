import { InputType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

// Enum para roles
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  READONLY = 'READONLY',
}

// Registrar el enum para GraphQL
registerEnumType(Role, {
  name: 'Role',
  description: 'Roles de usuario en el sistema',
});

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

@ObjectType()
export class UserPayload {
  @Field(() => Number)
  id!: number;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field(() => String)
  role!: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field(() => UserPayload)
  user!: UserPayload;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  oldPassword!: string;

  @Field()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword!: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;

  @Field(() => Role, { defaultValue: Role.USER })
  @IsOptional()
  @IsEnum(Role, { message: 'Rol inválido' })
  role?: Role;
}
