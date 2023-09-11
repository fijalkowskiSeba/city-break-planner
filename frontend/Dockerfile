# building angular app
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i && npm run build

FROM nginx
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 80

#docker build -t angular_app:1 .
#docker run -d -p 1111:80 angular_app:1
