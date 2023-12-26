/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        REACT_APP_ENV: 'development' | 'production' | 'testing' | 'staging'
        REACT_APP_BASE_URL: string
        REACT_APP_USERNAME: string
        REACT_APP_PASSWORD: string
        REACT_APP_ENCRYPTION_SECRET: string
    }
}
