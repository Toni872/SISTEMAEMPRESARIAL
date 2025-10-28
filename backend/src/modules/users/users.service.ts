import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUserInput, UpdateUserInput, ChangeUserPasswordInput } from './dto/user.input';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: CreateUserInput) {
        // Verificar si el email ya existe
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                role: (data.role || 'USER') as any,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findAll(skip = 0, take = 10, search?: string, role?: string, isActive?: boolean) {
        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return this.prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`Usuario #${id} no encontrado`);
        }

        return user;
    }

    async updateUser(data: UpdateUserInput) {
        await this.findOne(data.id);

        // Si se está actualizando el email, verificar que no exista
        if (data.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== data.id) {
                throw new ConflictException('El email ya está en uso por otro usuario');
            }
        }

        return this.prisma.user.update({
            where: { id: data.id },
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role as any,
                isActive: data.isActive,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async changeUserPassword(data: ChangeUserPasswordInput) {
        await this.findOne(data.id);

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        return this.prisma.user.update({
            where: { id: data.id },
            data: { password: hashedPassword },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async deactivateUser(id: number) {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async activateUser(id: number) {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: { isActive: true },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async removeUser(id: number) {
        await this.findOne(id);

        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getUserStats() {
        const [totalUsers, activeUsers, adminCount, managerCount, userCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: 'ADMIN' } }),
            this.prisma.user.count({ where: { role: 'MANAGER' } }),
            this.prisma.user.count({ where: { role: 'USER' } }),
        ]);

        return {
            totalUsers,
            activeUsers,
            adminUsers: adminCount,
            managerUsers: managerCount,
            regularUsers: userCount,
        };
    }
}
