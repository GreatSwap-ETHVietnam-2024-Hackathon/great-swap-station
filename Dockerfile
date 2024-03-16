FROM node:18-alpine as build

ARG ENVIRONMENT

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

# RUN npm run build:${ENVIRONMENT}
RUN yarn typechain
RUN yarn build

# prepare nginx
FROM nginx:1.25.1-alpine

COPY --from=build /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]