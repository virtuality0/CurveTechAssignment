FROM node:22-alpine
WORKDIR /src

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install 

# Copy Prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the source code
COPY . . 

RUN pnpm build 

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start:prod"]
