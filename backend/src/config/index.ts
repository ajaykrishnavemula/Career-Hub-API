import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Rate limiter configuration interface
interface RateLimiterConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max number of requests per windowMs
}

// Search configuration interface
interface SearchConfig {
  resultsPerPage: number;
  maxSearchDistance: number; // in kilometers
}

// Email configuration interface
interface EmailConfig {
  from: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
}

// Storage configuration interface
interface StorageConfig {
  resumeUploadPath: string;
  companyLogoPath: string;
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
}

// Elasticsearch configuration interface
interface ElasticsearchConfig {
  url: string;
  auth?: {
    username: string;
    password: string;
  };
  indexPrefix?: string;
}

// Configuration interface
interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  environment: 'development' | 'production' | 'test';
  nodeEnv: string;
  frontendUrl: string;
  rateLimiter: RateLimiterConfig;
  search: SearchConfig;
  email: EmailConfig;
  storage: StorageConfig;
  elasticsearch?: ElasticsearchConfig;
  maxLoginAttempts: number;
  lockTime: number; // in milliseconds
}

// Configuration object
const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/jobs-api',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimiter: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per windowMs
  },
  search: {
    resultsPerPage: parseInt(process.env.SEARCH_RESULTS_PER_PAGE || '10', 10),
    maxSearchDistance: parseInt(process.env.MAX_SEARCH_DISTANCE || '100', 10), // 100 km
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@jobs-api.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
  },
  storage: {
    resumeUploadPath: process.env.RESUME_UPLOAD_PATH || 'uploads/resumes',
    companyLogoPath: process.env.COMPANY_LOGO_PATH || 'uploads/logos',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx').split(','),
  },
  elasticsearch: process.env.ELASTICSEARCH_URL ? {
    url: process.env.ELASTICSEARCH_URL,
    auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD ? {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    } : undefined,
    indexPrefix: process.env.ELASTICSEARCH_INDEX_PREFIX || ''
  } : undefined,
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  lockTime: parseInt(process.env.LOCK_TIME || '3600000', 10), // 1 hour
};

export default config;

