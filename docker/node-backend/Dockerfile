FROM node:26-slim

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN if getent passwd ${USER_ID} > /dev/null; then \
        existing_user=$(getent passwd ${USER_ID} | cut -d: -f1); \
        usermod -l ${USER_NAME} -d /home/${USER_NAME} -m $existing_user 2>/dev/null || true; \
    else \
        useradd -l -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash ${USER_NAME} 2>/dev/null || \
        useradd -l -u ${USER_ID} -M -s /bin/bash ${USER_NAME} || true; \
    fi && \
    if getent group ${GROUP_ID} > /dev/null; then \
        existing_group=$(getent group ${GROUP_ID} | cut -d: -f1); \
        groupmod -n ${USER_NAME} $existing_group 2>/dev/null || true; \
    else \
        groupadd -g ${GROUP_ID} ${USER_NAME} || true; \
    fi

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fontconfig \
    libfreetype6 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/project

USER ${USER_NAME}
