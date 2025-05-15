FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install -g @nestjs/cli
RUN npm run build

FROM node:20-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE ${APP_PORT:-3000}
#CMD ["node", "dist/main.js"]
CMD ["npm", "run", "start:prod"]