import type { AppProps } from 'next/app'

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