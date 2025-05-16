# Etapa 1: Build da aplicação Angular Universal
FROM node:lts AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Etapa 2: Imagem final, com Node.js para SSR
FROM node:lts

WORKDIR /app

COPY --from=builder /app/dist/my-task-board /app/dist/my-task-board
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./

EXPOSE 8080

CMD ["node", "dist/my-task-board/server/main.js"]
