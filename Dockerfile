FROM node:20-alpine

# curl is needed in the entrypoint health-check loop
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and pre-compile contracts
COPY . .
RUN npx hardhat compile

EXPOSE 8545 4545

COPY docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
