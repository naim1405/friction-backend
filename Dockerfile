FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate       

COPY . .
RUN npm run build

EXPOSE 5000

# migrate at runtime, then start
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
