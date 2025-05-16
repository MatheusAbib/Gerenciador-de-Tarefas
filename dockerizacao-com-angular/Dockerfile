FROM node:18.19-alpine
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli && npm install --force
EXPOSE 4200
CMD ["npm","run", "cstart"]
