import app from '@src/app';
import { env } from '@src/config/env';
import { reset, blue } from '@src/utils/console-colors';

app.listen(env.SERVER_PORT, () => {
    console.info(`${blue}server${reset} - started at ${env.SERVER_URL}`);
});
