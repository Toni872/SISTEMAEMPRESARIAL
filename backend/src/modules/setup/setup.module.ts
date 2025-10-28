import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class SetupService {
    constructor(private prisma: PrismaService) { }

    async createCompany(createCompanyDto: CreateCompanyDto) {
        // Assuming Prisma schema has a Company model; if not, add it to schema.prisma
        return this.prisma.company.create({
            data: createCompanyDto,
        });
    }
}
import { Controller, Post, Body } from '@nestjs/common';

@Controller('setup')
export class SetupController {
    constructor(private readonly setupService: SetupService) { }

    @Post('company')
    async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
        return this.setupService.createCompany(createCompanyDto);
    }
}

@Module({
    controllers: [SetupController],
    providers: [SetupService, PrismaService],
})
export class SetupModule { }