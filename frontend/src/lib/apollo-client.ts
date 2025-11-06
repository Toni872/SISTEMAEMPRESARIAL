import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import type { GraphQLError } from 'graphql';

// En desarrollo, usar localhost; en Docker, usar el nombre del servicio
const getGraphQLUri = () => {
    // Prioridad 1: Variable de entorno explícita (para producción con backend)
    if (import.meta.env.VITE_GRAPHQL_URL) {
        return import.meta.env.VITE_GRAPHQL_URL;
    }

    // Si estamos en el navegador (cliente)
    if (typeof window !== 'undefined') {
        // En desarrollo, usar proxy de Vite (localhost:3001)
        if (import.meta.env.DEV) {
            return '/graphql';
        }
        
        // En producción SIN backend configurado, usar un endpoint dummy
        // que causará errores de red pero NO romperá la app
        // Las queries manejarán estos errores con estados vacíos
        return 'https://dummy-backend-for-visual-mode.vercel.app/graphql';
    }

    // En el servidor de desarrollo, usar el nombre del servicio de Docker
    return 'http://backend:3000/graphql';
};

const httpLink = createHttpLink({
    uri: getGraphQLUri(),
});

const authLink = setContext((_, { headers }) => {
    // Get token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;

    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.token;
        } catch (e) {
            // Silently fail - no backend available
        }
    }

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const errorLink = onError((errorResponse) => {
    const { graphQLErrors, networkError } = errorResponse as {
        graphQLErrors?: readonly GraphQLError[];
        networkError?: Error | null;
    };

    // Silenciar errores de red en producción para modo visual
    // Solo loguear en desarrollo
    if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
            if (import.meta.env.DEV) {
                console.error(`[GraphQL error]: Message: ${error.message}`);
            }
            // Si hay error de autenticación, limpiar localStorage y redirigir
            if (error.message === 'Unauthorized' || error.extensions?.code === 'UNAUTHENTICATED') {
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    localStorage.removeItem('auth-storage');
                    window.location.href = '/login';
                }
            }
        });
    }

    if (networkError) {
        // Solo mostrar errores de red en desarrollo
        // En producción, las queries manejarán el error silenciosamente
        if (import.meta.env.DEV) {
            console.error(`[Network error]: ${networkError.message}`);
        }
        // No hacer nada más - las queries mostrarán estados vacíos
    }
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all', // No romper la UI si hay errores
        },
        query: {
            errorPolicy: 'all', // No romper la UI si hay errores
        },
    },
});
