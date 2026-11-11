interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_MAPS_EMBED_QUERY?: string
  readonly VITE_MAPS_EMBED_KEY?: string
  readonly VITE_EVENT_ADDRESS?: string
  readonly VITE_EVENT_TIME?: string
  readonly VITE_HOST_WHATSAPP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
