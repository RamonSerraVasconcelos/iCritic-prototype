import { defineConfig, loadEnv } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, path.resolve(process.cwd(), '../'), 'CLIENT_'),
    };

    const CLIENT_PORT = Number(process.env.CLIENT_PORT) || 3000;

    dns.setDefaultResultOrder('verbatim');

    return defineConfig({
        plugins: [react()],
        server: {
            port: CLIENT_PORT,
        },
    });
};
