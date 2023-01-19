import { AppProps } from 'next/app';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
import '@theguild/components/style.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryParamProvider adapter={NextAdapter}>
      <Component {...pageProps} />
    </QueryParamProvider>
  );
}