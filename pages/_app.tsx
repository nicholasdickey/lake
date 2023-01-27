import type { AppProps } from 'next/app'
import {usePreserveScroll} from '../lib/usePreserveScroll'

/*
const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#0070f3',
  },
}
*/
export default function App({ Component, pageProps }: AppProps) {
  usePreserveScroll(); 
  return (
    <>
     
        
        <Component {...pageProps} />
        
    </>
  )
}