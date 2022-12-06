require('dotenv').config({
    path: '../.env',
});

const { i18n } = require('./next-i18next.config');

const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL
            ? process.env.SERVER_URL
            : `http://localhost:${process.env.SERVER_PORT || 8080}`,
    },
    i18n,
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
