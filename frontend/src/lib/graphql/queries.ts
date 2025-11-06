import { gql } from '@apollo/client';

// ==================== AUTHENTICATION ====================

export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($changePasswordInput: ChangePasswordInput!) {
    changePassword(changePasswordInput: $changePasswordInput)
  }
`;

// ==================== PRODUCTS ====================

export const GET_PRODUCTS = gql`
  query GetProducts($skip: Int = 0, $take: Int = 10, $search: String, $category: String) {
    products(skip: $skip, take: $take, search: $search, category: $category) {
      id
      name
      description
      sku
      price
      cost
      stock
      minStock
      maxStock
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      sku
      price
      cost
      stock
      minStock
      maxStock
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_SKU = gql`
  query GetProductBySku($sku: String!) {
    productBySku(sku: $sku) {
      id
      name
      description
      sku
      price
      cost
      stock
      minStock
      maxStock
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_LOW_STOCK_PRODUCTS = gql`
  query GetLowStockProducts {
    lowStockProducts {
      id
      name
      sku
      stock
      minStock
      price
      category
      isActive
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      description
      sku
      price
      cost
      stock
      minStock
      maxStock
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      id
      name
      description
      sku
      price
      cost
      stock
      minStock
      maxStock
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($id: Int!, $quantity: Int!, $operation: String!) {
    updateProductStock(id: $id, quantity: $quantity, operation: $operation) {
      id
      name
      sku
      stock
      minStock
      maxStock
    }
  }
`;

export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: Int!) {
    removeProduct(id: $id) {
      id
      name
      sku
    }
  }
`;

// ==================== SALES ORDERS ====================

export const GET_SALES_ORDERS = gql`
  query GetSalesOrders($skip: Int = 0, $take: Int = 10, $status: OrderStatus) {
    salesOrders(skip: $skip, take: $take, status: $status) {
      id
      orderNumber
      orderDate
      customerId
      customerName
      status
      totalAmount
      deliveryDate
      notes
      userId
      userName
      createdAt
      updatedAt
    }
  }
`;

export const GET_SALES_ORDER = gql`
  query GetSalesOrder($id: Int!) {
    salesOrder(id: $id) {
      id
      orderNumber
      orderDate
      customerId
      customerName
      status
      totalAmount
      deliveryDate
      notes
      userId
      userName
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SALES_ORDER = gql`
  mutation CreateSalesOrder($createSalesOrderInput: CreateSalesOrderInput!) {
    createSalesOrder(createSalesOrderInput: $createSalesOrderInput) {
      id
      orderNumber
      orderDate
      customerId
      customerName
      status
      totalAmount
      deliveryDate
      notes
      createdAt
    }
  }
`;

export const UPDATE_SALES_ORDER = gql`
  mutation UpdateSalesOrder($updateSalesOrderInput: UpdateSalesOrderInput!) {
    updateSalesOrder(updateSalesOrderInput: $updateSalesOrderInput) {
      id
      orderNumber
      status
      deliveryDate
      notes
      updatedAt
    }
  }
`;

export const CANCEL_SALES_ORDER = gql`
  mutation CancelSalesOrder($id: Int!) {
    cancelSalesOrder(id: $id) {
      id
      orderNumber
      status
      updatedAt
    }
  }
`;

// ==================== PURCHASE ORDERS ====================

export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders($skip: Int = 0, $take: Int = 10, $status: PurchaseOrderStatus) {
    purchaseOrders(skip: $skip, take: $take, status: $status) {
      id
      orderNumber
      orderDate
      supplierId
      supplierName
      status
      subtotal
      taxAmount
      totalAmount
      expectedDeliveryDate
      receivedDate
      notes
      userId
      userName
      createdAt
      updatedAt
    }
  }
`;

export const GET_PURCHASE_ORDER = gql`
  query GetPurchaseOrder($id: Int!) {
    purchaseOrder(id: $id) {
      id
      orderNumber
      orderDate
      supplierId
      supplierName
      status
      subtotal
      taxAmount
      totalAmount
      expectedDeliveryDate
      receivedDate
      notes
      userId
      userName
      items {
        id
        productId
        productName
        quantity
        unitPrice
        totalPrice
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PURCHASE_ORDER = gql`
  mutation CreatePurchaseOrder($createPurchaseOrderInput: CreatePurchaseOrderInput!) {
    createPurchaseOrder(createPurchaseOrderInput: $createPurchaseOrderInput) {
      id
      orderNumber
      orderDate
      supplierId
      status
      totalAmount
      createdAt
    }
  }
`;

export const UPDATE_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder($updatePurchaseOrderInput: UpdatePurchaseOrderInput!) {
    updatePurchaseOrder(updatePurchaseOrderInput: $updatePurchaseOrderInput) {
      id
      orderNumber
      status
      expectedDeliveryDate
      receivedDate
      notes
      updatedAt
    }
  }
`;

export const RECEIVE_PURCHASE_ORDER = gql`
  mutation ReceivePurchaseOrder($id: Int!) {
    receivePurchaseOrder(id: $id) {
      id
      orderNumber
      status
      receivedDate
      updatedAt
    }
  }
`;

export const CANCEL_PURCHASE_ORDER = gql`
  mutation CancelPurchaseOrder($id: Int!) {
    cancelPurchaseOrder(id: $id) {
      id
      orderNumber
      status
      updatedAt
    }
  }
`;

// ==================== CUSTOMERS ====================

export const GET_CUSTOMERS = gql`
  query GetCustomers($skip: Int = 0, $take: Int = 10, $search: String) {
    customers(skip: $skip, take: $take, search: $search) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: Int!) {
    customer(id: $id) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($createCustomerInput: CreateCustomerInput!) {
    createCustomer(createCustomerInput: $createCustomerInput) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($updateCustomerInput: UpdateCustomerInput!) {
    updateCustomer(updateCustomerInput: $updateCustomerInput) {
      id
      name
      email
      phone
      address
      city
      country
      updatedAt
    }
  }
`;

export const REMOVE_CUSTOMER = gql`
  mutation RemoveCustomer($id: Int!) {
    removeCustomer(id: $id) {
      id
      name
    }
  }
`;

// ==================== SALES INVOICES ====================

export const GET_SALES_INVOICES = gql`
  query GetSalesInvoices($skip: Int = 0, $take: Int = 10, $status: InvoiceStatus, $paymentStatus: PaymentStatus) {
    salesInvoices(skip: $skip, take: $take, status: $status, paymentStatus: $paymentStatus) {
      id
      invoiceNumber
      invoiceDate
      dueDate
      customerId
      customerName
      status
      paymentStatus
      subtotal
      taxAmount
      discountAmount
      total
      paidAmount
      outstandingAmount
      currency
      notes
      createdAt
      updatedAt
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
      payments {
        id
        amount
        paymentDate
        paymentMethod
        reference
        notes
      }
    }
  }
`;

export const GET_SALES_INVOICE = gql`
  query GetSalesInvoice($id: Int!) {
    salesInvoice(id: $id) {
      id
      invoiceNumber
      invoiceDate
      dueDate
      customerId
      customerName
      status
      paymentStatus
      subtotal
      taxAmount
      discountAmount
      total
      paidAmount
      outstandingAmount
      currency
      notes
      createdAt
      updatedAt
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
      payments {
        id
        amount
        paymentDate
        paymentMethod
        reference
        notes
      }
    }
  }
`;

// ==================== SUPPLIERS ====================

export const GET_SUPPLIERS = gql`
  query GetSuppliers($skip: Int = 0, $take: Int = 10, $search: String) {
    suppliers(skip: $skip, take: $take, search: $search) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPPLIER = gql`
  query GetSupplier($id: Int!) {
    supplier(id: $id) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($createSupplierInput: CreateSupplierInput!) {
    createSupplier(createSupplierInput: $createSupplierInput) {
      id
      name
      email
      phone
      address
      city
      country
      createdAt
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($updateSupplierInput: UpdateSupplierInput!) {
    updateSupplier(updateSupplierInput: $updateSupplierInput) {
      id
      name
      email
      phone
      address
      city
      country
      updatedAt
    }
  }
`;

export const REMOVE_SUPPLIER = gql`
  mutation RemoveSupplier($id: Int!) {
    removeSupplier(id: $id) {
      id
      name
    }
  }
`;

// ==================== USERS ====================

export const GET_USERS = gql`
  query GetUsers($skip: Int = 0, $take: Int = 10, $search: String, $role: Role, $isActive: Boolean) {
    users(skip: $skip, take: $take, search: $search, role: $role, isActive: $isActive) {
      id
      email
      firstName
      lastName
      role
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      role
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      firstName
      lastName
      role
      isActive
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      firstName
      lastName
      role
      isActive
      updatedAt
    }
  }
`;

export const ACTIVATE_USER = gql`
  mutation ActivateUser($id: Int!) {
    activateUser(id: $id) {
      id
      email
      isActive
      updatedAt
    }
  }
`;

export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: Int!) {
    deactivateUser(id: $id) {
      id
      email
      isActive
      updatedAt
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      id
      email
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangeUserPassword($changeUserPasswordInput: ChangeUserPasswordInput!) {
    changeUserPassword(changeUserPasswordInput: $changeUserPasswordInput) {
      id
      email
      updatedAt
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      totalUsers
      activeUsers
      adminUsers
      managerUsers
      regularUsers
    }
  }
`;

// ==================== DASHBOARD / ANALYTICS ====================

export const GET_INVENTORY_VALUE = gql`
  query GetInventoryValue {
    inventoryValue {
      totalProducts
      totalValue
      lowStockProducts
      outOfStockProducts
    }
  }
`;

export const GET_FINANCIAL_SUMMARY = gql`
  query GetFinancialSummary($startDate: DateTime, $endDate: DateTime) {
    financialSummary(startDate: $startDate, endDate: $endDate) {
      totalSales
      totalPurchases
      netProfit
      profitMargin
      totalOrders
      pendingOrders
    }
  }
`;

export const GET_MONTHLY_SALES = gql`
  query GetMonthlySales($year: Int!) {
    monthlySales(year: $year) {
      month
      total
      orderCount
    }
  }
`;

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts($limit: Int = 10) {
    topProducts(limit: $limit) {
      productId
      productName
      totalQuantity
      totalRevenue
    }
  }
`;

// ==================== DASHBOARD ====================

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    dashboardMetrics {
      operationalEfficiency
      operationalEfficiencyTrend
      aiModels {
        active
        training
        maintenance
        needsImprovement
      }
      processAutomation
      processAutomationTrend
      timeReduction
      roi {
        percentage
        operationalSavings
        revenueIncrease
      }
    }
  }
`;

export const GET_PERFORMANCE_DATA = gql`
  query GetPerformanceData($period: String) {
    performanceData(period: $period) {
      month
      efficiency
      automation
      sales
    }
  }
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($limit: Int) {
    recentActivities(limit: $limit) {
      activities {
        id
        type
        title
        description
        timestamp
        userId
        userName
        icon
        color
      }
      total
      unread
    }
  }
`;

export const GET_MODULE_STATUS = gql`
  query GetModuleStatus {
    moduleStatus {
      id
      name
      status
      uptime
      icon
      color
    }
  }
`;

// ==================== AI SERVICE (GraphQL → NestJS → FastAPI) ====================

export const GET_ACTIVE_AI_MODELS = gql`
  query GetActiveAIModels {
    activeAIModels {
      total_models
      operational
      training
      maintenance
      models {
        name
        status
        version
        accuracy
      }
    }
  }
`;

export const PREDICT_DEMAND = gql`
  query PredictDemand($productId: Float!, $days: Float) {
    predictDemand(productId: $productId, days: $days) {
      product_id
      predicted_units
      days
      confidence
      recommendations
      model_version
    }
  }
`;

export const OPTIMIZE_PRICE = gql`
  query OptimizePrice($productId: Float!, $currentPrice: Float!, $stock: Float!) {
    optimizePrice(productId: $productId, currentPrice: $currentPrice, stock: $stock) {
      optimal_price
      price_change_percentage
      expected_revenue_increase
      model_version
    }
  }
`;

export const GET_AI_METRICS = gql`
  query GetAiMetrics {
    aiMetrics {
      overall {
        throughputRps
        latencyMsP95
        latencyMsP99
        errorRate
      }
      series {
        ts
        accuracy
        latencyMsP95
        latencyMsP99
        throughputRps
        errorRate
      }
      recentPredictions {
        id
        productId
        units
        confidence
        ts
      }
      recentOptimizations {
        id
        productId
        optimalPrice
        deltaPct
        ts
      }
    }
  }
`;

export const DEPLOY_AI_MODEL = gql`
  mutation DeployAIModel($name: String!, $version: String!) {
    deployAIModel(name: $name, version: $version) { success message }
  }
`;