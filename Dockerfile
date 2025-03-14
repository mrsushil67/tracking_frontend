# Stage 1: Build the Vite React application with Node.js 22
FROM node:22 AS build
WORKDIR /app
ARG VITE_REACT_APP_BACKEND_URL
ARG VITE_REACT_APP_AUTH_URL
ARG VITE_REACT_APP_MAP_KEY

ENV VITE_REACT_APP_BACKEND_URL=$VITE_REACT_APP_BACKEND_URL
ENV VITE_REACT_APP_AUTH_URL=$VITE_REACT_APP_AUTH_URL
ENV VITE_REACT_APP_MAP_KEY=$VITE_REACT_APP_MAP_KEY

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
