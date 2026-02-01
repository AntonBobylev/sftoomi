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

RUN apt-get update && apt-get install -y --no-install-recommends \
    zlib1g-dev \
    g++ \
    git \
    libicu-dev \
    libzip-dev \
    zip \
    autoconf \
    pkg-config \
    libssl-dev \
    fontconfig \
    libjpeg62-turbo \
    libxrender1 \
    libxext6 \
    xfonts-base \
    xfonts-75dpi \
    fonts-dejavu \
    fonts-freefont-ttf \
    wget \
    && wget https://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1w-0+deb11u4_amd64.deb \
    && apt-get install -y ./libssl1.1_1.1.1w-0+deb11u4_amd64.deb \
    && rm libssl1.1_1.1.1w-0+deb11u4_amd64.deb \
    && wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb \
    && apt-get install -y ./wkhtmltox_0.12.6-1.buster_amd64.deb \
    && rm wkhtmltox_0.12.6-1.buster_amd64.deb \
    && docker-php-ext-install intl opcache pdo pdo_mysql zip \
    && pecl install apcu redis xdebug \
    && docker-php-ext-enable apcu redis xdebug \
    && echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host = host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && apt-get purge -y --auto-remove autoconf pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION%%.*}.x | bash - && \
    apt-get install -y nodejs

RUN npm i -g @angular/cli

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/project

USER ${USER_ID}
RUN USER_NAME=${USER_NAME}
