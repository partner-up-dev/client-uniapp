/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_MAIN_URL: string
  readonly VITE_BACKEND_MAIN_API_VERSION: string
  readonly VITE_BACKEND_RIDE_HAILING_URL: string
  readonly VITE_BACKEND_RIDE_HAILING_API_VERSION: string
  readonly VITE_BACKEND_ACCOUNT_URL: string
  readonly VITE_BACKEND_ACCOUNT_API_VERSION: string
  readonly VITE_SUPABASE_SERVER_URL: string
  readonly VITE_SUPABASE_ANYONYMOUS_KEY: string
  readonly VITE_TENCENT_LBS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
