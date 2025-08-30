# ---------------------------
# STAGE 1 - Builder
# ---------------------------
FROM node:20-slim AS builder

ENV TZ=Etc/UTC

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Dependências necessárias para build
RUN apt-get update && apt-get install -y \
  python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN npm install

# Copia todo o código
COPY . .

# Gera build Nest.js
RUN npm run build


# ---------------------------
# STAGE 2 - Runner
# ---------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instala Chromium e dependências de runtime
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libgtk-3-0 \
  libnss3 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Copia apenas package.json para instalar deps de produção
COPY package*.json ./
RUN npm install --omit=dev

# Copia o build pronto do estágio builder
COPY --from=builder /app/dist/src ./dist/src

# Porta padrão NestJS
EXPOSE 8080

# Inicia a aplicação
CMD ["node", "dist/src/main.js"]