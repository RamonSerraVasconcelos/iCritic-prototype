import app from '@src/app';
import env from '@src/config/env';

app.listen(env.SERVER_PORT, () => {
    console.log(`Server running on ${env.SERVER_URL}`);
});
