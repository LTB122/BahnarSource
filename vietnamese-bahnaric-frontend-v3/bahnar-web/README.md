# Bahnar Web Application

Frontend web application for the Bahnar language learning platform, built with React and Tailwind CSS.

## 🚀 Features

- Modern, responsive user interface
- Interactive language learning tools
- Real-time translation capabilities
- Dark/Light mode
- Multi-language support
- Docker containerization with Nginx

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
yarn install
# or
npm install
```

2. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3501
```

3. Start the development server:
```bash
yarn start
# or
npm start
```

The application will be available at http://localhost:3000

### Option 2: Docker Deployment

#### Using Docker Compose (Recommended)

The service is configured to run as part of the complete BahnarSource stack. From the root directory:

```bash
docker-compose up bahnar-web
```

Or to run all services:

```bash
docker-compose up
```

#### Running Standalone

To run just the web application:

```bash
docker build -t bahnar-web .
docker run -p 80:80 bahnar-web
```

## 🔧 Configuration

The service uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | URL of the backend API | http://localhost:3501 |

## 📦 Project Structure

```
.
├── public/           # Static files
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/      # Page components
│   ├── styles/     # CSS styles
│   └── utils/      # Utility functions
├── Dockerfile       # Docker configuration
├── nginx.conf      # Nginx configuration
└── package.json    # Dependencies and scripts
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`.

## 🧪 Testing

```bash
yarn test
# or
npm test
```

## 🔧 Development Tools

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

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
npm install
```

2. If port 3000 is already in use:
```bash
# Find process using port 3000
lsof -i :3000  # On Linux/Mac
netstat -ano | findstr :3000  # On Windows
# Kill the process or use a different port
```

3. If build fails:
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### Docker Issues

1. If the service fails to start, check the logs:
```bash
docker-compose logs bahnar-web
```

2. If you need to rebuild the service:
```bash
docker-compose up --build bahnar-web
```

3. If you need to restart the service:
```bash
docker-compose restart bahnar-web
```

4. If you need to clear the build cache:
```bash
docker-compose build --no-cache bahnar-web
```
