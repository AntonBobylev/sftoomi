FROM php:8.4-fpm

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN groupadd -g ${GROUP_ID} ${USER_NAME} && \
    useradd -l -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash ${USER_NAME}

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    && install-php-extensions intl pdo_mysql zip redis \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash -s -- --install-dir=/usr/local/bin

WORKDIR /var/www/project

RUN chown -R ${USER_ID}:${GROUP_ID} /var/www

USER ${USER_NAME}
