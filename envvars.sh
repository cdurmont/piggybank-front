#!/bin/bash

envsubst < /usr/share/nginx/html/assets/config/config.prod.json > /usr/share/nginx/html/assets/config/config.json
envsubst "\$PIGGYBANK_BACKEND_URL" < /temp/default.conf > /etc/nginx/conf.d/default.conf
exec "$@"
