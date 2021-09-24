#
# Builder stage.
#
FROM node:16 AS builder

WORKDIR /usr/src/app

COPY . ./

RUN npm ci --quiet
RUN node_modules/.bin/ng build --prod

#
# Production stage.
#
FROM nginx:1.20.0-alpine
EXPOSE 4200

WORKDIR /app

## static content from previous stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
## nginx config, including backend reverse proxy settings
COPY nginx.conf /etc/nginx/templates/default.conf.template

