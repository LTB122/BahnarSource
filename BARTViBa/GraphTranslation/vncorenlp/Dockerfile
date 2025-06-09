# File: vncorenlp/Dockerfile
FROM openjdk:8-jre

WORKDIR /app

# Copy VNCoreNLP jar
COPY VnCoreNLP-1.1.1.jar .

# Expose port
EXPOSE 9000

# Start VNCoreNLP server
CMD ["java", "-Xmx2g", "-cp", "VnCoreNLP-1.1.1.jar", "vncorenlp.VnCoreNLPServer", "-port", "9000", "-annotators", "wseg,pos,ner,parse"]
