FROM node:18.3-alpine as builder
WORKDIR /usr/src
RUN npm install -g pnpm
RUN npm install send
COPY . .
RUN pnpm install
RUN pnpm run build

FROM node:18.3-alpine
WORKDIR /usr/src
RUN npm install -g pnpm
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/hack ./
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
EXPOSE $PORT
CMD ["/bin/sh", "docker-entrypoint.sh"]