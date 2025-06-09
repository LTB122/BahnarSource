FROM eclipse-temurin:8-jre-alpine

WORKDIR /app

COPY GraphTranslation/vncorenlp/VnCoreNLP-1.1.1.jar /app/vncorenlp/
COPY GraphTranslation/vncorenlp/models /app/vncorenlp/models/

ENV VNCORENLP_HOME=/app/vncorenlp
ENV VNCORENLP_MODELS=/app/vncorenlp/models

EXPOSE 9000

CMD ["java", "-Xmx2g", "-jar", "/app/vncorenlp/VnCoreNLP-1.1.1.jar", "-port", "9000", "-annotators", "wseg,pos,ner,parse"]
