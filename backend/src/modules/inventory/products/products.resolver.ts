import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';

@Resolver(() => Product)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @Roles('ADMIN', 'MANAGER')
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: any,
  ) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  @Roles('ADMIN', 'MANAGER', 'USER')
  findAllProducts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('category', { nullable: true }) category?: string,
    @CurrentUser() user?: any,
  ) {
    return this.productsService.findAll(skip, take, search, category);
  }

  @Query(() => Product, { name: 'product' })
  @Roles('ADMIN', 'MANAGER', 'USER')
  findOneProduct(@Args('id', { type: () => Int }) id: number, @CurrentUser() user?: any) {
    return this.productsService.findOne(id);
  }

  @Query(() => Product, { name: 'productBySku' })
  @Roles('ADMIN', 'MANAGER', 'USER')
  findProductBySku(@Args('sku') sku: string, @CurrentUser() user?: any) {
    return this.productsService.findBySku(sku);
  }

  @Query(() => [Product], { name: 'lowStockProducts' })
  @Roles('ADMIN', 'MANAGER')
  getLowStockProducts(@CurrentUser() user?: any) {
    return this.productsService.getLowStockProducts();
  }

  @Mutation(() => Product)
  @Roles('ADMIN', 'MANAGER')
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: any,
  ) {
    return this.productsService.update(updateProductInput.id, updateProductInput);
  }

  @Mutation(() => Product)
  @Roles('ADMIN')
  removeProduct(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: any) {
    return this.productsService.remove(id);
  }

  @Mutation(() => Product)
  @Roles('ADMIN', 'MANAGER')
  updateProductStock(
    @Args('id', { type: () => Int }) id: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @Args('operation') operation: 'ADD' | 'SUBTRACT',
    @CurrentUser() user: any,
  ) {
    return this.productsService.updateStock(id, quantity, operation);
  }
}
