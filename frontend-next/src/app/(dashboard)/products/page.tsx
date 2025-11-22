'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Package,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Layers,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { ProductForm } from '@/components/products/product-form';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { exportProductsToCSV } from '@/lib/utils/export';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Métricas
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalCategories: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, productsCount, lowStockProducts] = await Promise.all([
        apiClient.getProducts(0, 1000, searchTerm || undefined, selectedCategory !== 'all' ? selectedCategory : undefined),
        apiClient.getProductsCount(true),
        apiClient.getLowStockProducts(),
      ]);

      setProducts(productsData);
      
      const totalValue = productsData.reduce((sum: number, p: any) => {
        const price = parseFloat(p.price) || 0;
        const stock = parseInt(p.stock) || 0;
        return sum + (price * stock);
      }, 0);

      const categories = new Set(productsData.map((p: any) => p.category).filter(Boolean));

      setMetrics({
        totalProducts: productsCount.count || 0,
        totalValue,
        lowStockCount: lowStockProducts.length || 0,
        totalCategories: categories.size,
      });
    } catch (err: any) {
      logger.error('Error fetching products', err);
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const handleCreateProduct = async (formData: any) => {
    try {
      setFormLoading(true);
      await apiClient.createProduct({
        name: formData.name,
        description: formData.description || undefined,
        sku: formData.sku || undefined,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        stock: parseInt(formData.stock) || 0,
        min_stock: parseInt(formData.min_stock) || 0,
        category: formData.category || undefined,
        is_active: formData.is_active,
      });
      setFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
      toast({
        title: "Producto creado",
        description: "El producto se ha creado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error creating product', err);
      toast({
        title: "Error",
        description: err.message || 'Error al crear producto',
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    if (!editingProduct) return;
    
    try {
      setFormLoading(true);
      await apiClient.updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description || undefined,
        sku: formData.sku || undefined,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        stock: parseInt(formData.stock) || 0,
        min_stock: parseInt(formData.min_stock) || 0,
        category: formData.category || undefined,
        is_active: formData.is_active,
      });
      setFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error updating product', err);
      toast({
        title: "Error",
        description: err.message || 'Error al actualizar producto',
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeletingId(productToDelete);
      await apiClient.deleteProduct(productToDelete);
      await fetchProducts();
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente.",
        variant: "success",
      });
    } catch (err: any) {
      logger.error('Error deleting product', err);
      toast({
        title: "Error",
        description: err.message || 'Error al eliminar producto',
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const metricsData = [
    {
      title: 'Total Productos',
      value: metrics.totalProducts.toString(),
      change: '+0',
      trend: 'up' as const,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Valor Total Inventario',
      value: `€${metrics.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: '+0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Stock Bajo',
      value: metrics.lowStockCount.toString(),
      change: metrics.lowStockCount > 0 ? 'Atención' : 'OK',
      trend: metrics.lowStockCount > 0 ? ('down' as const) : ('up' as const),
      icon: AlertTriangle,
      color: metrics.lowStockCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400',
      bgColor: metrics.lowStockCount > 0 ? 'bg-orange-50 dark:bg-orange-950' : 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Categorías Activas',
      value: metrics.totalCategories.toString(),
      change: '+0',
      trend: 'up' as const,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Productos
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Administra tu inventario y productos de forma eficiente
          </p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants}>
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metricsData.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : AlertTriangle;
            
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1 text-neutral-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={metric.trend === 'up' ? 'default' : 'destructive'}
                        className="gap-1 text-xs"
                      >
                        <TrendIcon className="h-3 w-3" />
                        {metric.change}
                      </Badge>
                    </div>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar productos por nombre o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Todas
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        exportProductsToCSV(products);
                        toast({
                          title: "Exportación exitosa",
                          description: `Se exportaron ${products.length} productos a CSV`,
                          variant: "success",
                        });
                      } catch (error: any) {
                        logger.error('Error al exportar', error);
                        toast({
                          title: "Error al exportar",
                          description: error.message || "No se pudo exportar los productos",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={products.length === 0}
                    type="button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button 
                    className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleCreateClick}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Table */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Listado de Productos</CardTitle>
                  <CardDescription>
                    Mostrando {filteredProducts.length} de {products.length} productos
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      exportProductsToCSV(filteredProducts);
                      toast({
                        title: "Exportación exitosa",
                        description: `Se exportaron ${filteredProducts.length} productos a CSV`,
                        variant: "success",
                      });
                    } catch (error: any) {
                      logger.error('Error al exportar', error);
                      toast({
                        title: "Error al exportar",
                        description: error.message || "No se pudo exportar los productos",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={filteredProducts.length === 0}
                  type="button"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Producto
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          SKU
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Categoría
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Precio
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Stock
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Valor Total
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => {
                        const price = parseFloat(product.price) || 0;
                        const stock = parseInt(product.stock) || 0;
                        const isDeleting = deletingId === product.id;

                        return (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02, duration: 0.15 }}
                            className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-neutral-900 dark:text-white">
                                    {product.name}
                                  </p>
                                  {product.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {product.sku ? (
                                <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded font-mono">
                                  {product.sku}
                                </code>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {product.category ? (
                                <Badge variant="secondary">{product.category}</Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold text-neutral-900 dark:text-white">
                                €{price.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Badge
                                variant={
                                  stock === 0
                                    ? 'destructive'
                                    : stock < 10
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {stock} unidades
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold text-neutral-900 dark:text-white">
                                €{(price * stock).toLocaleString('es-ES', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(product);
                                  }}
                                  type="button"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600 hover:text-red-700 cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteClick(product.id);
                                  }}
                                  disabled={isDeleting}
                                  type="button"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No se encontraron productos</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Product Form Modal */}
      <ProductForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        loading={formLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDeleteProduct}
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer. El producto será eliminado permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
