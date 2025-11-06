import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
    GET_DASHBOARD_METRICS,
    GET_PERFORMANCE_DATA,
    GET_RECENT_ACTIVITIES,
    GET_MODULE_STATUS,
} from '../lib/graphql/queries';

interface Activity {
    id: number;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
    userId?: number;
    userName?: string;
    icon?: string;
    color?: string;
}

interface DashboardMetrics {
    operationalEfficiency: number;
    operationalEfficiencyTrend?: number;
    aiModels: {
        active: number;
        training: number;
        maintenance: number;
        needsImprovement: number;
    };
    processAutomation: number;
    processAutomationTrend?: number;
    timeReduction: number;
    roi: {
        percentage: number;
        operationalSavings: number;
        revenueIncrease: number;
    };
}

interface PerformancePoint {
    month: string;
    efficiency: number;
    automation: number;
    sales: number;
}

interface ModuleStatus {
    id: string;
    name: string;
    status: string;
    uptime: number;
    icon: string;
    color: string;
}

// Hook para obtener métricas del dashboard
export const useDashboardMetrics = () => {
    const { data, loading, error } = useQuery<{ dashboardMetrics: DashboardMetrics }>(
        GET_DASHBOARD_METRICS,
        {
            pollInterval: 60000, // Actualizar cada minuto
        }
    );

    return {
        metrics: data?.dashboardMetrics,
        loading,
        error: error?.message,
    };
};

// Hook para obtener datos de performance
export const usePerformanceData = (period: string = 'year') => {
    const { data, loading, error } = useQuery<{ performanceData: PerformancePoint[] }>(
        GET_PERFORMANCE_DATA,
        {
            variables: { period },
            pollInterval: 300000, // Actualizar cada 5 minutos
        }
    );

    return {
        performanceData: data?.performanceData || [],
        loading,
        error: error?.message,
    };
};

// Hook para obtener actividades recientes
export const useRecentActivities = (limit: number = 10) => {
    const { data, loading, error } = useQuery<{
        recentActivities: {
            activities: Activity[];
            total: number;
            unread: number;
        };
    }>(GET_RECENT_ACTIVITIES, {
        variables: { limit },
        pollInterval: 30000, // Actualizar cada 30 segundos
    });

    return {
        activities: data?.recentActivities.activities || [],
        total: data?.recentActivities.total || 0,
        unread: data?.recentActivities.unread || 0,
        loading,
        error: error?.message,
    };
};

// Hook para obtener estado de módulos
export const useModuleStatus = () => {
    const { data, loading, error } = useQuery<{ moduleStatus: ModuleStatus[] }>(
        GET_MODULE_STATUS,
        {
            pollInterval: 60000, // Actualizar cada minuto
        }
    );

    return {
        modules: data?.moduleStatus || [],
        loading,
        error: error?.message,
    };
};

// Hook principal del dashboard (combina todos)
export const useDashboardData = () => {
    const { activities, total, unread, loading: activitiesLoading, error: activitiesError } =
        useRecentActivities(10);

    return {
        activities,
        total,
        unread,
        loading: activitiesLoading,
        error: activitiesError,
    };
};
// Hook para métricas en tiempo real (compatibilidad con componente existente)
export const useRealtimeMetrics = () => {
    const [metrics, setMetrics] = useState({
        eficienciaOperacional: 94.7,
        modelosIA: 32,
        automatizacion: 87.4,
        roi: 85.0,
    });

    useEffect(() => {
        // Simular actualización de métricas cada 10 segundos
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                eficienciaOperacional: Math.min(100, prev.eficienciaOperacional + (Math.random() - 0.5) * 0.5),
                modelosIA: Math.max(28, prev.modelosIA + Math.floor((Math.random() - 0.5) * 2)),
                automatizacion: Math.min(100, prev.automatizacion + (Math.random() - 0.5) * 0.3),
                roi: Math.min(100, prev.roi + (Math.random() - 0.5) * 0.4),
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return metrics;
};
