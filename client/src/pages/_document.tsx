import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { getCssText } from '@src/config/stitches.config';

export default class Document extends NextDocument {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="icon" href="/images/favicon.png" />
                    <style
                        id="stitches"
                        dangerouslySetInnerHTML={{ __html: getCssText() }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
