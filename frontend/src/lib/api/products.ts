import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Product {
    id: number
    name: string
    description?: string
    sku: string
    price: number
    cost?: number
    stock: number
    minStock: number
    maxStock?: number
    category?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateProductInput {
    name: string
    description?: string
    sku: string
    price: number
    cost?: number
    stock?: number
    minStock?: number
    maxStock?: number
    category?: string
    isActive?: boolean
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: number
}

export interface ProductsResponse {
    products: Product[]
    total: number
    hasMore: boolean
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            // Add auth token if available
            const token = localStorage.getItem('authToken')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, {
            skip?: number
            take?: number
            search?: string
            category?: string
        }>({
            query: ({ skip = 0, take = 10, search, category }) => {
                const params = new URLSearchParams({
                    skip: skip.toString(),
                    take: take.toString(),
                })
                if (search) params.append('search', search)
                if (category) params.append('category', category)

                return `/products?${params.toString()}`
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        getProduct: builder.query<Product, number>({
            query: (id) => `/products/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),

        getProductBySku: builder.query<Product, string>({
            query: (sku) => `/products/sku/${sku}`,
            providesTags: (_result, _error, sku) => [{ type: 'Product', id: sku }],
        }),

        getLowStockProducts: builder.query<Product[], void>({
            query: () => '/products/low-stock',
            providesTags: [{ type: 'Product', id: 'LOW_STOCK' }],
        }),

        createProduct: builder.mutation<Product, CreateProductInput>({
            query: (newProduct) => ({
                url: '/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        updateProduct: builder.mutation<Product, UpdateProductInput>({
            query: ({ id, ...patch }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        deleteProduct: builder.mutation<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        updateStock: builder.mutation<Product, {
            id: number
            quantity: number
            operation: 'ADD' | 'SUBTRACT'
        }>({
            query: ({ id, quantity, operation }) => ({
                url: `/products/${id}/stock`,
                method: 'PATCH',
                body: { quantity, operation },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
                { type: 'Product', id: 'LOW_STOCK' },
            ],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetProductBySkuQuery,
    useGetLowStockProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStockMutation,
} = productsApi