import 'styled-components'

declare module 'styled-components' {

    export interface DefaultTheme {
        light: {
            colors: {
                highlight:string
                lowlight: string
                text: string
                background: string
                link: string
                button: string
                stars: string[]
            }
        },
        dark: {
            colors: {
                lowlight: string
                highlight: string
                text: string
                background: string
                link: string
                button: string
                stars: string[]
            }
        }
    }
}