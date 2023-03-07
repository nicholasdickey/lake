import 'styled-components'

declare module 'styled-components' {

    export interface DefaultTheme {
        light: {
            colors: {
                qwiketBorderStale: Interpolation<ThemeProps<DefaultTheme>>
                qwiketBorderRecent: Interpolation<ThemeProps<DefaultTheme>>
                qwiketBorderNew: Interpolation<ThemeProps<DefaultTheme>>
                notificationButton: Interpolation<ThemeProps<DefaultTheme>>
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
                qwiketBorderStale: Interpolation<ThemeProps<DefaultTheme>>
                qwiketBorderRecent: Interpolation<ThemeProps<DefaultTheme>>
                qwiketBorderNew: Interpolation<ThemeProps<DefaultTheme>>
                notificationButton: Interpolation<ThemeProps<DefaultTheme>>
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