# BahnarSource - Vietnamese-Bahnar Translation System

A comprehensive translation system for Vietnamese to Bahnar language, built with modern technologies and microservices architecture.

## 🏗️ System Architecture

The system consists of four main components:

### 1. BARTViBa Translation Service
- Port: 10000
- Features:
  - Vietnamese-Bahnar translation using BART model
  - Multiple model types support (BART, BART_CHUNK, BART_CHUNK_NER_ONLY)
  - VNCoreNLP integration for text processing
  - FastAPI-based REST API

### 2. VNCoreNLP Service
- Port: 9000
- Features:
  - Vietnamese text processing
  - Word segmentation
  - Part-of-speech tagging
  - Named entity recognition
  - Dependency parsing

### 3. Bahnar Backend API
- Port: 3501
- Features:
  - RESTful API endpoints
  - User authentication
  - Translation request handling
  - MongoDB integration
  - Swagger documentation

### 4. Bahnar Web Frontend
- Port: 80 (production) / 3000 (development)
- Features:
  - Modern React-based UI
  - Real-time translation
  - Dark/light mode
  - Responsive design
  - Tailwind CSS styling

## 🔧 Local Installation Guide

### 1. Prerequisites
- Node.js 16.x or higher
- Python 3.8 or higher
- MongoDB (Community Server or MongoDB Compass)
- Java 8 or higher (for VnCoreNLP)

### 2. Setup MongoDB
Option 1: Using MongoDB Compass (Recommended)
   - Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
   - Open MongoDB Compass
   - Click "New Connection"
   - Choose one of these connection strings:
     * Local MongoDB: `mongodb://localhost:27017`
     * Docker MongoDB: `mongodb://mongodb:27017` (if using Docker)
   - Click "Connect"
   - Create new database named `bahnar-translator`

Option 2: Install MongoDB Community Server
   - Windows:
     * Download and install from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
     * Start MongoDB service
   - macOS:
     * Using Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
     * Start MongoDB service: `brew services start mongodb-community`
   - Create database directory: `mkdir -p ~/data/db`

### Step 1: Clone and Setup
```bash
git clone <repository-url>
cd BahnarSource
```

### Step 2: Environment Configuration

1. **Backend (.env)**
```env
PORT=3501
DB_URI=mongodb://localhost:27017/bahnar-translator
SERVICE_NAME=bahnar-backend
TOKEN_TTL=7d
COOKIE_KEY=your_cookie_key
JWT_SECRET=your_jwt_secret
HASH_ROUNDS=10
BARTVIBA_URL=http://localhost:10000
```

2. **Bahnar-Web (.env)**
```env
REACT_APP_API_URL=http://localhost:3501
```

### Step 3: Install and Run Services

1. **BARTViBa Service**
```bash
cd BARTViBa
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start VNCoreNLP server first
java -Xmx2g -cp vncorenlp/VnCoreNLP-1.1.1.jar vncorenlp.VnCoreNLPServer -port 9000 -annotators "wseg,pos,ner,parse"

# In a new terminal, start the BARTViBa service
python app.py
```

2. **Backend Service**
```bash
cd vietnamese-bahnaric-frontend-v3/bahnar-backend
npm install
npm start
```

3. **Frontend Service**
```bash
cd vietnamese-bahnaric-frontend-v3/bahnar-web
npm install
npm start
```

### Step 4: Verify Installation

Access the following URLs in your browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3501
- Translation Service: http://localhost:10000
- API Documentation: http://localhost:3501/api-docs

## 📦 Docker Deployment (Optional)

If you prefer using Docker, follow these steps:

### Prerequisites
- Docker
- Docker Compose

### Quick Start with Docker
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up --build [service-name]
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
```bash
# Check port usage
netstat -ano | findstr :<port>  # Windows
lsof -i :<port>  # Linux/Mac
```

2. **MongoDB Connection**
- Ensure MongoDB is running
- Check connection string in backend .env
- Verify network connectivity

3. **VNCoreNLP Issues**
- Verify Java installation
- Check port 9000 availability
- Ensure correct JAR file path

4. **Python Virtual Environment**
```bash
# If venv issues occur
rm -rf venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. **Node.js Dependencies**
```bash
# If dependency issues occur
rm -rf node_modules
npm install
```

## 📚 Documentation

- API Documentation: http://localhost:3501/api-docs
- Translation Service: http://localhost:10000/docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.