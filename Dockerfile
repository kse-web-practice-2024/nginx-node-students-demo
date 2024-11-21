FROM nginx:latest

RUN apt-get update && apt-get install -y curl gnupg supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY static /home/html

COPY package.json /home/package.json
COPY src/main.js /home/main.js
COPY node_modules /home/node_modules
#
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
