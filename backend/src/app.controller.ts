import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Information' })
  @ApiResponse({ status: 200, description: 'API information' })
  getRoot() {
    return {
      name: 'ERP System API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        graphql: '/graphql',
        docs: '/api/docs',
        api: '/api',
      },
      message: 'Welcome to ERP System API. Use /api/docs for API documentation or /graphql for GraphQL Playground.',
    };
  }
}



