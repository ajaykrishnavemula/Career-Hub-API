import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import jobsRoutes from './routes/jobs';
import companiesRoutes from './routes/companies';
import applicantsRoutes from './routes/applicants';
import searchRoutes from './routes/search';
import analyticsRoutes from './routes/analytics';
import messagingRoutes from './routes/messaging';

// Import middleware
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import { loggerMiddleware } from './utils/logger';
import rateLimiter from './middleware/rate-limiter';

// Import config
import config from './config';

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Create Express app
const app: Express = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Logger middleware
app.use(loggerMiddleware);

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: config.environment,
    timestamp: new Date().toISOString(),
  });
});

// API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/companies', companiesRoutes);
app.use('/api/v1/applicants', applicantsRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/messages', messagingRoutes);

// Handle 404 errors
app.use(notFoundMiddleware);

// Handle errors
app.use(errorHandlerMiddleware);

export default app;

