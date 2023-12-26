FROM node:16.10.0 as base

WORKDIR /app
# Add package file
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./packages/server /app/packages/server
COPY ./packages/shared /app/packages/shared
COPY ./tsconfig.base.json /app/tsconfig.base.json

# Install deps
RUN npm i --production

# Build dist
RUN npm run build-server

# Start production image build
FROM gcr.io/distroless/nodejs:16

# Copy node modules and build directory
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/packages/server/cassandra_data ./cassandra_data
COPY --from=base /app/packages/server/package.json ./package.json

ENV DATABASE_URL mongodb://localhost:27017/hie-db?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000
ENV ENVIRONMENT DEV
ENV CASSANDRA_CRT_PATH ./cassandra_data/cleverchain.crt
ENV CASSANDRA_KEY_PATH ./cassandra_data/cleverchain_private.key
ENV CASSANDRA_PORT 9042
ENV CASSANDRA_KEYSPACE clever_chain
ENV CASSANDRA_USERNAME cassandra
ENV CASSANDRA_PASSWORD cassandra

# Expose port 5000
EXPOSE 3001
CMD ["packages/server/dist/src/app.js"]
