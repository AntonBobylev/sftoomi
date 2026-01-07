FROM php:8.4.13-fpm
ENV NODE_VERSION=24.12.0

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN groupadd -g $GROUP_ID -o $USER_NAME || true
RUN useradd -m -u $USER_ID -g $GROUP_ID -o -s /bin/bash $USER_NAME
RUN chown -R ${USER_ID}:${GROUP_ID} /var/www && \
    chmod 755 -R /var/www

RUN mkdir -p app/node_modules/.cache && chmod -R 777 app/node_modules/.cache

RUN apt-get update && apt-get install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host = host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION%%.*}.x | bash - && \
    apt-get install -y nodejs

RUN npm i -g @angular/cli

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/project

USER ${USER_ID}
RUN USER_NAME=${USER_NAME}
