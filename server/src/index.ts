import app from '@src/app';
import { env } from '@src/config/env';
import { reset, bold, green } from '@src/utils/console-colors';

app.listen(env.SERVER_PORT, () => {
    const arrow = `  ${green}➜${reset}${bold} `;
    const url = `${reset}${green} http://localhost:${bold}${env.SERVER_PORT}${reset}${green}/ ${reset}\n`;

    console.log(`${arrow} Server: ${url}`);
});
