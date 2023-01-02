import type { AppProps } from 'next/app'
import { ThemeProvider, DefaultTheme } from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import { Inter } from '@next/font/google'
/*
const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#0070f3',
  },
}
*/
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
     
        
        <Component {...pageProps} />
     
    </>
  )
}