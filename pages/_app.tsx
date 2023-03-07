import type { AppProps } from 'next/app'
import { usePreserveScroll } from '../lib/usePreserveScroll'

export default function App({ Component, pageProps }: AppProps) {
  usePreserveScroll();
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}