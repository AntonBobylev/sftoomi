FROM php:8.4-fpm

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN groupadd -g ${GROUP_ID} ${USER_NAME} || true && \
    useradd -l -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash ${USER_NAME} || true

RUN mkdir -p /var/www/project && \
    chown -R ${USER_ID}:${GROUP_ID} /var/www

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install intl opcache pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/project

USER ${USER_NAME}
