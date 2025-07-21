import { registerAs } from "@nestjs/config";

export default registerAs('app.config', () => ({
    appName: process.env.APP_NAME || 'MyApp',
    appVersion: process.env.APP_VERSION || '1.0.0',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
}));