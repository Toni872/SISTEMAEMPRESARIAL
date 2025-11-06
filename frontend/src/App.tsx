import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import SetupPage from './pages/SetupPage';
import MainLayout from './components/layout/MainLayout';
import ModulePlaceholder from './pages/ModulePlaceholder';
import AiEnginePage from './pages/AiEnginePage';
import LogisticsPage from './pages/LogisticsPage';
import BusinessCorePage from './pages/BusinessCorePage';
import AutomationCenterPage from './pages/AutomationCenterPage';
import MobileOpsPage from './pages/MobileOpsPage';
import IntegrationLayerPage from './pages/IntegrationLayerPage';
import RealtimeDataPage from './pages/RealtimeDataPage';
import CustomerEngagementPage from './pages/CustomerEngagementPage';
import SupplierNetworkPage from './pages/SupplierNetworkPage';
import FinancialOpsPage from './pages/FinancialOpsPage';
import PlatformAnalyticsPage from './pages/PlatformAnalyticsPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import SecurityGovernancePage from './pages/SecurityGovernancePage';
import ConfigEnginePage from './pages/ConfigEnginePage';
import CommunicationsCenterPage from './pages/CommunicationsCenterPage';
import KnowledgeManagementPage from './pages/KnowledgeManagementPage';
import InfrastructurePage from './pages/InfrastructurePage';
import LabPage from './pages/LabPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
                }
            />
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                }
            />

            {/* Protected Routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                {/* Extra módulos del menú ejecutivo */}
                <Route path="/ai-engine" element={<AiEnginePage />} />
                <Route path="/logistics" element={<LogisticsPage />} />
                <Route path="/business-core" element={<BusinessCorePage />} />
                <Route path="/automation-center" element={<AutomationCenterPage />} />
                <Route path="/mobile-ops" element={<MobileOpsPage />} />
                <Route path="/integration-layer" element={<IntegrationLayerPage />} />
                <Route path="/realtime-data" element={<RealtimeDataPage />} />
                <Route path="/customer-engagement" element={<CustomerEngagementPage />} />
                <Route path="/supplier-network" element={<SupplierNetworkPage />} />
                <Route path="/financial-ops" element={<FinancialOpsPage />} />
                <Route path="/platform-analytics" element={<PlatformAnalyticsPage />} />
                <Route path="/document-management" element={<DocumentManagementPage />} />
                <Route path="/security-governance" element={<SecurityGovernancePage />} />
                <Route path="/config-engine" element={<ConfigEnginePage />} />
                <Route path="/communications-center" element={<CommunicationsCenterPage />} />
                <Route path="/knowledge-management" element={<KnowledgeManagementPage />} />
                <Route path="/infrastructure" element={<InfrastructurePage />} />
                <Route path="/lab" element={<LabPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;