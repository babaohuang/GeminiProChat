FROM node:latest
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/hack ./

CMD ["/bin/sh", "docker-entrypoint.sh"]