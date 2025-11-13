import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStats } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, ChangeUserPasswordInput } from './dto/user.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/dto/auth.dto';

@Resolver(() => User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  @Roles('ADMIN')
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @Roles('ADMIN', 'MANAGER')
  findAllUsers(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('role', { type: () => Role, nullable: true }) role?: Role,
    @Args('isActive', { nullable: true }) isActive?: boolean,
  ) {
    return this.usersService.findAll(skip, take, search, role, isActive);
  }

  @Query(() => User, { name: 'user' })
  @Roles('ADMIN', 'MANAGER')
  findOneUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @Roles('ADMIN')
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(updateUserInput);
  }

  @Mutation(() => User)
  @Roles('ADMIN')
  changeUserPassword(
    @Args('changeUserPasswordInput') changeUserPasswordInput: ChangeUserPasswordInput,
  ) {
    return this.usersService.changeUserPassword(changeUserPasswordInput);
  }

  @Mutation(() => User)
  @Roles('ADMIN')
  deactivateUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.deactivateUser(id);
  }

  @Mutation(() => User)
  @Roles('ADMIN')
  activateUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.activateUser(id);
  }

  @Mutation(() => User)
  @Roles('ADMIN')
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.removeUser(id);
  }

  @Query(() => UserStats, { name: 'userStats' })
  @Roles('ADMIN')
  getUserStats() {
    return this.usersService.getUserStats();
  }
}
