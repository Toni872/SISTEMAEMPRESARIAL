import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
export class CreateCompanyDto {
    name!: string;
    // Add other fields as needed, e.g., address?: string;
}
@Injectable()
export class SetupService {
    constructor(private readonly prisma: PrismaService) { }
    async createCompany(data: CreateCompanyDto) {
        // Check if company already exists
        const existing = await this.prisma.company.findFirst();
        if (existing) {
            throw new Error('Company already exists');
        }
        return this.prisma.company.create({ data });
    }
    async getCompany() {
        return this.prisma.company.findFirst();
    }
    async isSetupComplete(): Promise<boolean> {
        const company = await this.prisma.company.findFirst();
        return !!company;
    }
}