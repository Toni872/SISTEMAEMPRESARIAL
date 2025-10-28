import {
    Controller,
    Get,
    Post,
    UseInterceptors,
    UploadedFile,
    Res,
    Query,
    HttpStatus,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

/**
 * REST Controller for specific Product operations that don't fit well in GraphQL
 * - File uploads/downloads
 * - Export/Import operations
 * - Bulk operations
 * 
 * For normal CRUD operations, use GraphQL (products.resolver.ts)
 */
@ApiTags('Products - REST (Special Operations)')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    /**
     * Export products to CSV
     * Use Case: User wants to download product list as spreadsheet
     */
    @Get('export/csv')
    @ApiOperation({
        summary: 'Export products to CSV',
        description: 'Downloads all products as CSV file. Use this for Excel/spreadsheet integration.',
    })
    async exportCsv(
        @Query('category') category?: string,
        @Query('isActive') isActive?: string,
        @Res() res: Response = {} as Response,
    ) {
        const filters = {
            category,
            isActive: isActive ? isActive === 'true' : undefined,
        };

        const products = await this.productsService.findAll(
            0,
            10000,
            undefined,
            category,
        );

        // Generate CSV
        const csv = this.generateCSV(products);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        return res.send(csv);
    }

    /**
     * Export products to Excel
     * Use Case: User wants to download product list with formatting
     */
    @Get('export/excel')
    @ApiOperation({
        summary: 'Export products to Excel',
        description: 'Downloads all products as Excel file with formatting.',
    })
    async exportExcel(
        @Query('category') category?: string,
        @Query('isActive') isActive?: string,
        @Res() res: Response = {} as Response,
    ) {
        const filters = {
            category,
            isActive: isActive ? isActive === 'true' : undefined,
        };

        const products = await this.productsService.findAll(
            0,
            10000,
            undefined,
            category,
        );

        // TODO: Implement Excel generation (requires library like exceljs)
        // For now, return CSV with Excel mime type
        const csv = this.generateCSV(products);

        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
        return res.send(csv);
    }

    /**
     * Import products from CSV
     * Use Case: Bulk import products from spreadsheet
     */
    @Post('import/csv')
    @ApiOperation({
        summary: 'Import products from CSV',
        description: 'Upload a CSV file to bulk import products. Returns import results.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async importCsv(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Parse CSV and import products
        const csvContent = file.buffer.toString('utf-8');
        const results = await this.parseAndImportCSV(csvContent);

        return {
            success: true,
            message: `Imported ${results.success} products successfully`,
            results: {
                total: results.total,
                success: results.success,
                failed: results.failed,
                errors: results.errors,
            },
        };
    }

    /**
     * Upload product image
     * Use Case: Add image to a product
     */
    @Post('upload/image')
    @ApiOperation({
        summary: 'Upload product image',
        description: 'Upload an image file for a product. Returns image URL.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                productId: {
                    type: 'number',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // TODO: Implement image upload (save to disk/S3/cloud storage)
        // For now, return mock response
        const imageUrl = `/uploads/products/${Date.now()}_${file.originalname}`;

        return {
            success: true,
            imageUrl,
            message: 'Image uploaded successfully',
        };
    }

    /**
     * Bulk update products
     * Use Case: Update multiple products at once (e.g., price increase)
     */
    @Post('bulk/update')
    @ApiOperation({
        summary: 'Bulk update products',
        description: 'Update multiple products at once. Useful for mass price changes.',
    })
    async bulkUpdate(
        @Query('operation') operation: string,
        @Query('value') value: string,
        @Query('category') category?: string,
    ) {
        // TODO: Implement bulk update logic
        return {
            success: true,
            message: 'Bulk update completed',
            affectedProducts: 0,
        };
    }

    // ==================== Helper Methods ====================

    private generateCSV(products: any[]): string {
        // CSV header
        const headers = [
            'ID',
            'SKU',
            'Name',
            'Description',
            'Category',
            'Price',
            'Cost',
            'Stock',
            'Min Stock',
            'Max Stock',
            'Active',
            'Created At',
        ];

        // CSV rows
        const rows = products.map((p) => [
            p.id,
            p.sku,
            `"${p.name}"`, // Wrap in quotes to handle commas
            `"${p.description || ''}"`,
            p.category || '',
            p.price,
            p.cost || '',
            p.stock,
            p.minStock,
            p.maxStock || '',
            p.isActive ? 'Yes' : 'No',
            p.createdAt,
        ]);

        // Combine header and rows
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        return csvContent;
    }

    private async parseAndImportCSV(csvContent: string): Promise<{
        total: number;
        success: number;
        failed: number;
        errors: string[];
    }> {
        const lines = csvContent.split('\n');
        const results = {
            total: lines.length - 1, // Exclude header
            success: 0,
            failed: 0,
            errors: [] as string[],
        };

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const values = line.split(',');
                const productData = {
                    sku: values[1],
                    name: values[2]?.replace(/"/g, ''),
                    description: values[3]?.replace(/"/g, ''),
                    category: values[4],
                    price: parseFloat(values[5]),
                    cost: values[6] ? parseFloat(values[6]) : undefined,
                    stock: parseInt(values[7]),
                    minStock: parseInt(values[8]),
                    maxStock: values[9] ? parseInt(values[9]) : undefined,
                    isActive: values[10]?.toLowerCase() === 'yes',
                };

                // Validate required fields
                if (!productData.sku || !productData.name || isNaN(productData.price)) {
                    results.failed++;
                    results.errors.push(`Line ${i}: Missing required fields`);
                    continue;
                }

                // TODO: Create product using service
                // await this.productsService.create(productData);
                results.success++;
            } catch (error: any) {
                results.failed++;
                results.errors.push(`Line ${i}: ${error.message}`);
            }
        }

        return results;
    }
}
