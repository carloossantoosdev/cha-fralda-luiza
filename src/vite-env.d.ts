interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_MAPS_EMBED_QUERY?: string
  readonly VITE_MAPS_EMBED_KEY?: string
  readonly VITE_EVENT_ADDRESS?: string
  readonly VITE_EVENT_TIME?: string
  readonly VITE_HOST_WHATSAPP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
