# building angular app
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i && npm run build --configuration=production

FROM nginx
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
