import { Module } from '@nestjs/common';
import { WebflowService } from './webflow.service';
import { WebflowController } from './webflow.controller';
import { WebflowResolver } from './webflow.resolver';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [WebflowService, WebflowResolver],
    controllers: [WebflowController],
    exports: [WebflowService],
})
export class WebflowModule { }

