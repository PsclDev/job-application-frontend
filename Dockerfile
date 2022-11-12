FROM node:18.9-alpine AS build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install
COPY . .

ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL

RUN yarn build


FROM nginx:1.23-alpine

ARG NODE_ENV=production
ARG DOCKER_TAG
ENV app_version=$DOCKER_TAG

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80