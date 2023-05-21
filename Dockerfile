# Stage 1 - Build Vue App
FROM node:16.20-alpine as build

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

RUN npm run build

# Stage 2 - Deploy with NGNIX
FROM nginx:1.21-alpine as prod-stage

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]