# index.ts

import express from 'express';
import { json } from 'body-parser';
import { setUserRoutes } from './api/routes/user.routes';
import { setCalendarRoutes } from './api/routes/calendar.routes';
import { setDeviceRoutes } from './api/routes/device.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(authMiddleware);

// Routes
setUserRoutes(app);
setCalendarRoutes(app);
setDeviceRoutes(app);

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});