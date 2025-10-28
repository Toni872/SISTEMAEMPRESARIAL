import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import {
    LoginInput,
    AuthPayload,
    UserPayload,
    ChangePasswordInput,
    RegisterInput,
} from './dto/auth.dto';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => AuthPayload)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => AuthPayload)
    async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthPayload> {
        return this.authService.register(registerInput);
    }

    @Query(() => UserPayload)
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: any): Promise<UserPayload> {
        return this.authService.getCurrentUser(user.id);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @CurrentUser() user: any,
        @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    ): Promise<boolean> {
        return this.authService.changePassword(
            user.id,
            changePasswordInput.oldPassword,
            changePasswordInput.newPassword,
        );
    }
}
