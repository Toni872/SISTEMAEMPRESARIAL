/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_JWT_STORAGE_KEY: string
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
