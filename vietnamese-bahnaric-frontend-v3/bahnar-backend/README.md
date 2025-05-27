# Bahnar Backend API

Backend API service for the Bahnar language learning platform, built with Node.js, Express, and TypeScript.

## 🚀 Features

- RESTful API endpoints for Bahnar language learning
- Authentication and authorization
- Database integration
- API documentation
- TypeScript support
- Docker containerization

## 📋 Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Docker (optional)
- MongoDB (local or remote)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bahnar-backend
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/bahnar_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# API Configuration
API_PREFIX=/api/v1

# Environment
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Environment Variables Explanation

| Variable | Description | Default/Example |
|----------|-------------|-----------------|
| PORT | Port number for the server | 3000 |
| DATABASE_URL | MongoDB connection URL | mongodb://localhost:27017/bahnar_db |
| JWT_SECRET | Secret key for JWT token generation | your_super_secret_jwt_key_here |
| API_PREFIX | API route prefix | /api/v1 |
| NODE_ENV | Environment mode | development |
| CORS_ORIGIN | Allowed origin for CORS | http://localhost:3000 |
| LOG_LEVEL | Logging level | debug |

> Note: Make sure to never commit the `.env` file to version control. A `.env.example` file is provided as a template.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
yarn dev
# or
npm run dev
```

### Production Mode
```bash
yarn build
yarn start
# or
npm run build
npm start
```

### Using Docker
```bash
docker build -t bahnar-backend .
docker run -p 3000:3000 bahnar-backend
```

## 📚 API Documentation

API documentation is available at `/api-docs` when running the server.

## 🧪 Testing

```bash
yarn test
# or
npm test
```

## 📦 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🔐 Security Considerations

1. Always use strong, unique values for `JWT_SECRET`
2. Keep your `.env` file secure and never commit it to version control
3. Use environment-specific values for different deployment environments
4. Regularly rotate sensitive credentials

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
