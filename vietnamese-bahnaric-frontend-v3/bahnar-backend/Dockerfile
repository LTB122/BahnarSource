FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3501

# Set environment variables
ENV PORT=3501
ENV BARTVIBA_URL=http://bartviba:10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3501/health || exit 1

# Start the application
CMD ["npm", "start"] 
