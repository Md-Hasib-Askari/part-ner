import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'postgres',
    synchronize: process.env.DB_SYNCHRONIZE === 'true', // Default to true in development
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true'
}));