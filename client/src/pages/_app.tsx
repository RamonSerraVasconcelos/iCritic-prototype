import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { globalStyles } from '@src/assets/styles/global';

function App({ Component, pageProps }: AppProps) {
    globalStyles();

    return <Component {...pageProps} />;
}

export default appWithTranslation(App);
