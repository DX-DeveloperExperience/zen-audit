FROM node:10 as node
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --prod

FROM nginx:1.17
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/angular-test /usr/share/nginx/html
