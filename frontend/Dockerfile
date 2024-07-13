FROM nginx

RUN rm -f /etc/nginx/conf.d/* /docker-entrypoint.d/*
COPY nginx.conf /etc/nginx/
COPY dist /usr/share/nginx/html
