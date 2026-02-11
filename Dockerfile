FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma/
RUN npx prisma generate

# Copy app
COPY . .
RUN npm run build

# Run migrations and start
CMD npx prisma migrate deploy && npm run start
