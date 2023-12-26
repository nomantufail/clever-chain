# pull official base image
FROM node:16.10.0 as base

# set working directory
WORKDIR /app

# Add package file
COPY ./package.json /app/package.json
COPY ./packages/client /app/packages/client
COPY ./packages/shared /app/packages/shared
COPY ./tsconfig.base.json /app/tsconfig.base.json
COPY ./packages/client/nginx.conf /app/nginx.conf

# Remove unnecessary files
RUN rm -rf /app/packages/client/build;
RUN rm -rf /app/packages/shared/dist;
RUN rm -rf /app/packages/client/tsconfig.json;
RUN rm -rf /app/packages/client/src/App.test.tsx;

# Add production tsconfig file
COPY ./packages/client/tsconfig.production.json /app/packages/client/tsconfig.json

# Install deps
RUN npm i --production

# Build dist
RUN npm run build-client:prod

# Start production image build
FROM nginx:alpine
COPY --from=base /app/packages/client/build /usr/share/nginx/html
COPY --from=base /app/nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/*
ADD ./packages/client/service.conf /etc/nginx/conf.d/

EXPOSE 80
