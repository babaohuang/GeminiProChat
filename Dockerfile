FROM node:18.3-alpine as builder
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install
RUN npm run build

FROM node:18.3-alpine
WORKDIR /usr/src
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/hack ./
COPY package.json pnpm-lock.yaml ./
RUN npm install
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
EXPOSE $PORT
CMD ["/bin/sh", "docker-entrypoint.sh"]