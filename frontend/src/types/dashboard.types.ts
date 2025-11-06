// Types for Dashboard Executive
export interface MetricData {
    title: string;
    value: string | number;
    subtitle: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    progress?: {
        value: number;
        color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    };
    metrics?: Array<{
        label: string;
        value: string | number;
        color: string;
    }>;
}

export interface ChartDataPoint {
    name: string;
    [key: string]: string | number;
}

export interface Activity {
    id: string;
    title: string;
    timestamp: string;
    type: 'optimization' | 'ai' | 'automation' | 'analytics' | 'leads' | 'report';
}

export interface DashboardModule {
    id: string;
    name: string;
    status: 'active' | 'warning' | 'inactive';
    color: string;
}

export interface PerformanceMetrics {
    eficienciaOperacional: number;
    modelosIA: number;
    automatizacion: number;
    roi: number;
    timestamp: Date;
}

export interface FinancialMetrics {
    ahorroOperativo: number;
    incrementoIngresos: number;
    costoReduccion: number;
    margenMejora: number;
}

export interface AIMetrics {
    modelosActivos: number;
    enEntrenamiento: number;
    enMantenimiento: number;
    requiereMejoramiento: number;
    precision: number;
}
