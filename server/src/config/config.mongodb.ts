import 'dotenv/config'

interface AppConfig {
    port: number;
}

interface DBConfig {
    host: string | undefined;
    pass: string | undefined;
    name: string | undefined;
    dbName : string | undefined;
}

interface EnvironmentConfig {
    app: AppConfig;
    db: DBConfig;
}

const dev: EnvironmentConfig = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT || '8080', 10),
    },
    db: {
        host: process.env.DEV_DB_HOST_MONGODB,
        pass: process.env.DEV_PASSWORD_MONGODB,
        name: process.env.DEV_USERNAME_MONGODB,
        dbName: process.env.DEV_DB_NAME,
    },
};


const product: EnvironmentConfig = {
    app: {
        port: parseInt(process.env.PRO_APP_PORT || '8080', 10),
    },
    db: {
        host: process.env.PRO_DB_HOST_MONGODB,
        pass: process.env.PRO_PASSWORD_MONGODB,
        name: process.env.PRO_USERNAME_MONGODB,
        dbName: process.env.PRO_DB_NAME,
    },
};

const config: { [key: string]: EnvironmentConfig } = { dev, product };
const env: string = process.env.NODE_ENV || "dev";

export default config[env];