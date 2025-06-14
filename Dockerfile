# BARTViBa
FROM python:3.8-slim as bartviba
WORKDIR /app
COPY BARTViBa/requirements.txt .
RUN pip install -r requirements.txt
COPY BARTViBa/ .
RUN mkdir -p /app/pretrained /app/data

# Bahnar Backend
FROM node:18-alpine as bahnar-backend
WORKDIR /app
COPY vietnamese-bahnaric-frontend-v3/bahnar-backend/package*.json ./
RUN npm install
COPY vietnamese-bahnaric-frontend-v3/bahnar-backend/ .

# Bahnar Web
FROM node:18-alpine as bahnar-web
WORKDIR /app
COPY vietnamese-bahnaric-frontend-v3/bahnar-web/package*.json ./
RUN npm install
COPY vietnamese-bahnaric-frontend-v3/bahnar-web/ .
RUN npm run build

# Final stage
FROM python:3.8-slim
WORKDIR /app

# Copy BARTViBa
COPY --from=bartviba /app /app/bartviba
COPY --from=bartviba /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages

# Copy Backend
COPY --from=bahnar-backend /app /app/bahnar-backend

# Copy Frontend
COPY --from=bahnar-web /app /app/bahnar-web

# Startup
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
