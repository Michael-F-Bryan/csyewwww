declare global {
    namespace NodeJS {
      interface ProcessEnv {
        /**
         * The API key for accessing the Google Maps API.
         */
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      }
    }
  }

export {}
