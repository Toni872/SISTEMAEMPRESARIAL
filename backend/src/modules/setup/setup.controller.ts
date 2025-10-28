import { Controller, Post, Get, Body } from '@nestjs/common';
import { SetupService } from './setup.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('setup')
export class SetupController {
    constructor(private readonly setupService: SetupService) { }

    @Post('company')
    async createCompany(@Body() data: CreateCompanyDto) {
        return this.setupService.createCompany(data);
    }

    @Get('company')
    async getCompany() {
        return this.setupService.getCompany();
    }

    @Get('status')
    async getSetupStatus() {
        const isComplete = await this.setupService.isSetupComplete();
        return { isSetupComplete: isComplete };
    }
}