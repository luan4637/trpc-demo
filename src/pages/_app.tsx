import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { type AppType, AppProps } from 'next/app'
import { api } from '../utils/api'
import DefaultLayout from '../components/DefaultLayout'
import '../styles/global.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const App: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

    return getLayout(<Component {...pageProps} />);
};

// const App: AppType = ({ Component, pageProps }: AppProps) => {
//     return <Component {...pageProps} />;
// };

export default api.withTRPC(App)