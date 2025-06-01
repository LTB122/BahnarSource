# BahnarSource

This README provides instructions on how to run the BahnarSource project using either local development or Docker deployment. The project consists of three main components: BARTViBa model service, Bahnar backend API, and Bahnar web frontend.

## Project Components:

1. **BARTViBa Model Service:**
   - Provides the translation model
   - Runs on port 8000
   - Handles translation requests from the backend

2. **Bahnar Backend API:**
   - Provides REST API endpoints
   - Runs on port 3501
   - Communicates with BARTViBa model service

3. **Bahnar Web Frontend:**
   - React-based web application
   - Runs on port 80
   - Communicates with the backend API

## Prerequisites:

### For Local Development:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Git

### For Docker Deployment:
- Docker
- Docker Compose

## How to Run:

### Option 1: Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd BahnarSource
```

2. Set up BARTViBa service:
```bash
cd BARTViBa
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Set up Bahnar Backend:
```bash
cd ../vietnamese-bahnaric-frontend-v3/bahnar-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

4. Set up Bahnar Web:
```bash
cd ../bahnar-web
npm install
# Create .env file with REACT_APP_API_URL=http://localhost:3501
npm start
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3501
- BARTViBa Model: http://localhost:10000

### Option 2: Docker Deployment (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd BahnarSource
```

2. Build and start all services:
```bash
docker-compose up --build
```

This will:
- Build all necessary Docker images
- Start all services in the correct order
- Set up the required network between services
- Mount necessary volumes for model files

The services will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3501
- BARTViBa Model: http://localhost:8000

### Running in Background

To run the services in the background:
```bash
docker-compose up --build -d
```

### Viewing Logs

To view logs from all services:
```bash
docker-compose logs -f
```

To view logs from a specific service:
```bash
docker-compose logs -f [service-name]
# Example: docker-compose logs -f bartviba
```

### Stopping the Services

To stop all services:
```bash
docker-compose down
```

## Development

Each component has its own README with specific development instructions:

- [BARTViBa/README.md](BARTViBa/README.md)
- [vietnamese-bahnaric-frontend-v3/bahnar-backend/README.md](vietnamese-bahnaric-frontend-v3/bahnar-backend/README.md)
- [vietnamese-bahnaric-frontend-v3/bahnar-web/README.md](vietnamese-bahnaric-frontend-v3/bahnar-web/README.md)

## Troubleshooting

### Local Development Issues

1. If Python virtual environment issues occur:
```bash
# Remove existing venv
rm -rf venv
# Create new venv
python -m venv venv
# Activate and reinstall dependencies
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. If Node.js dependencies issues occur:
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### Docker Issues

1. If services fail to start, check the logs:
```bash
docker-compose logs
```

2. If you need to rebuild a specific service:
```bash
docker-compose up --build [service-name]
# Example: docker-compose up --build bartviba
```

3. If you need to restart a specific service:
```bash
docker-compose restart [service-name]
# Example: docker-compose restart bahnar-backend
```

4. If you need to clear all Docker resources:
```bash
docker-compose down -v
docker system prune -a
```
