FROM node:18-slim

# Instala ferramentas essenciais
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  gnupg \
  ca-certificates

# Adiciona chave GPG e repositório do Google Chrome
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg && \
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Instala o Chrome e dependências necessárias para rodá-lo
RUN apt-get update && apt-get install -y \
  google-chrome-stable \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxext6 \
  libnss3 \
  libnspr4 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libpangocairo-1.0-0 \
  libglib2.0-0 \
  xdg-utils && \
  rm -rf /var/lib/apt/lists/*

# Caminho do Chrome usado pelo puppeteer-core
ENV CHROME_EXEC_PATH=/usr/bin/google-chrome


WORKDIR /usr/app

COPY package.json ./
RUN npm install

COPY src ./src
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ENV OPENCEP_API=https://opencep.com/v1


RUN echo "\
  MONGO_URI=${MONGO_URI}\n\
  OPENCEP_API=${OPENCEP_API}\n\
  CHROME_EXEC_PATH=${CHROME_EXEC_PATH}\n\
  " > .env

RUN npm i -g pnpm
RUN pnpm build

EXPOSE 8080

CMD ["node", "./dist/src/main"]