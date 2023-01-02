import 'styled-components'

declare module 'styled-components' {

    export interface DefaultTheme {
        light: {
            colors: {
                text: string
                background: string
                link: string
                button: string
                stars: string[]
            }
        },
        dark: {
            colors: {
                text: string
                background: string
                link: string
                button: string
                stars: string[]
            }
        }
    }
}