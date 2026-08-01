FROM node:20-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# uid/gid 1000 = utilisateur "node" de l'image = utilisateur "ayico" sur le Pi,
# pour que node_modules cree sur le volume monte appartienne a ayico (pas root).
USER node

EXPOSE 8081

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npx", "expo", "start"]
