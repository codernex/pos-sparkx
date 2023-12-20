FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /apps
COPY . .
RUN pnpm install
EXPOSE 3000 9000
CMD ["pnpm", "dev"]