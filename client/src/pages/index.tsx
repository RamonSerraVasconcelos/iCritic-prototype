import Head from 'next/head';
import { styled } from '@src/config/stitches.config';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Text = styled('p', {
    variants: {
        size: {
            1: {
                fontSize: '50px',
            },
        },
    },
});

export default function Home() {
    const { t } = useTranslation();

    return (
        <div>
            <Head>
                <title>iCritic</title>
            </Head>
            <main>
                <Text size="1">{t('home:title')}</Text>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['home'])),
        },
    };
};
