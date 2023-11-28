# Build spring-boot app
FROM maven:3.8.4-openjdk-17-slim AS builder
WORKDIR /app
COPY . .
WORKDIR /etc/nginx/ssl/live/city-break-planner.sebastian-fijalkowski.online
RUN openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out /app/src/main/resources/keystore.p12 -name tomcat -CAfile chain.pem -caname root -passout pass:1111
WORKDIR /app
RUN . /app/.okta.env && mvn install

# Run spring-boot app
FROM maven:3.8.4-openjdk-17-slim
WORKDIR /app
COPY --from=builder /app/target/backend-1.jar /app/backend-1.jar
COPY --from=builder /app/.okta.env /app/.okta.env
EXPOSE 8080
EXPOSE 8443
CMD . /app/.okta.env && java -jar /app/backend-1.jar
