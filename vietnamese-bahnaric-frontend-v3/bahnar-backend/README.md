# Bahnar Backend API

Backend API service for the Bahnar language learning platform, built with Node.js, Express, and TypeScript.

## 🚀 Features

- RESTful API endpoints for Bahnar language learning
- Integration with BARTViBa translation service
- API documentation with Swagger UI
- TypeScript support
- Docker containerization
- Health check endpoints

## 📋 Prerequisites

### For Local Development
- Node.js (v16 or higher)
- npm or yarn
- Git

### For Docker Deployment
- Docker and Docker Compose

## 🛠️ Installation

### Option 1: Local Development

1. Install dependencies:
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

2. Create a `.env` file in the root directory:
```env
PORT=3501
DB_URI=mongodb://localhost:27017/bahnar-translator
SERVICE_NAME=bahnar-backend
TOKEN_TTL=7d
COOKIE_KEY=your_cookie_key
JWT_SECRET=your_jwt_secret
HASH_ROUNDS=10
BARTVIBA_URL=https://localhost:10000
```

3. Start the server:
```bash
# Using npm
npm start

# Or using yarn
yarn start
```

The service will be available at http://localhost:3501

### Option 2: Docker Deployment

#### Using Docker Compose (Recommended)

The service is configured to run as part of the complete BahnarSource stack. From the root directory:

```bash
docker-compose up bahnar-backend
```

Or to run all services:

```bash
docker-compose up
```

#### Running Standalone

To run just the backend service:

```bash
docker build -t bahnar-backend .
docker run -p 3501:3501 bahnar-backend
```

## 🔧 Configuration

The service uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number for the server | 3501 |
| DB_URI | MongoDB connection string | mongodb://localhost:27017/bahnar-translator |
| SERVICE_NAME | Name of the service | bahnar-backend |
| TOKEN_TTL | Token time-to-live duration | 7d |
| COOKIE_KEY | Secret key for cookie encryption | your_cookie_key |
| JWT_SECRET | Secret key for JWT token generation | your_jwt_secret |
| HASH_ROUNDS | Number of rounds for password hashing | 10 |
| BARTVIBA_URL | URL of the BARTViBa translation service | https://localhost:10000 |

## �� API Documentation

API documentation is available at `/api-docs` when running the server. The service provides the following endpoints:

- `POST /translate`: Translate text between Vietnamese and Bahnar
- `GET /health`: Health check endpoint

## 🧪 Testing

```bash
# Using npm
npm test

# Or using yarn
yarn test
```

## 📦 Project Structure

```
.
├── src/                # Source code
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── dist/              # Compiled JavaScript files
├── Dockerfile         # Docker configuration
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── nodemon.json       # Nodemon configuration
```

## 🔐 Security Considerations

1. The service is designed to run within a Docker network
2. All sensitive configuration should be provided through environment variables
3. The service communicates with BARTViBa through internal Docker network

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔍 Troubleshooting

### Local Development Issues

1. If Node.js dependencies issues occur:
```bash
# Remove node_modules and reinstall
rm -rf node_modules

# Using npm
npm install

# Or using yarn
yarn install
```

2. If port 3501 is already in use:
```bash
# Find process using port 3501
lsof -i :3501  # On Linux/Mac
netstat -ano | findstr :3501  # On Windows
# Kill the process or use a different port
```

3. If TypeScript compilation fails:
```bash
# Clear TypeScript cache
rm -rf dist

# Using npm
npm run build

# Or using yarn
yarn build
```

### Docker Issues

1. If the service fails to start, check the logs:
```bash
docker-compose logs bahnar-backend
```

2. If you need to rebuild the service:
```bash
docker-compose up --build bahnar-backend
```

3. If you need to restart the service:
```bash
docker-compose restart bahnar-backend
```

4. If you need to clear the build cache:
```bash
docker-compose build --no-cache bahnar-backend
```

5. If you can't connect to the service from other containers:
- Check if the containers are on the same Docker network
- Verify the environment variables are set correctly
- Check the Docker logs for any startup errors
