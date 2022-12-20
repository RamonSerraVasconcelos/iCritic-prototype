import { globalCss } from '@src/config/stitches.config';
import localFont from '@next/font/local';

const outfitFont = localFont({
    src: [
        {
            path: '../fonts/Outfit-Regular.ttf',
            weight: '400',
        },
        {
            path: '../fonts/Outfit-Bold.ttf',
            weight: '700',
        },
    ],
    style: 'normal',
    preload: true,
});

export const globalStyles = globalCss({
    '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        background: 'none',
        textDecoration: 'none',
        fontFamily: outfitFont.style.fontFamily,
        fontWeight: 'bold',
        border: 'none',
        webkitFontSmoothing: 'antialiased',
        mozOsxFontSmoothing: 'grayscale',
    },
});
