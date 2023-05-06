// ./components/globalstyles.ts
import { createGlobalStyle, css } from 'styled-components'

const lightValues = css`
  --text: ${({ theme }) => theme.light.colors.text};
  --background: ${({ theme }) => theme.light.colors.background};
  --highBackground: ${({ theme }) => theme.light.colors.highBackground};
  --link: ${({ theme }) => theme.light.colors.link};
  --highlight: ${({ theme }) => theme.light.colors.highlight};
  --lowlight: ${({ theme }) => theme.light.colors.lowlight};
  --button: ${({ theme }) => theme.light.colors.button};
  --notificationButton: ${({ theme }) => theme.light.colors.notificationButton};
  --star1:${({ theme }) => theme.light.colors.stars[1]};
  --star2:${({ theme }) => theme.light.colors.stars[2]};
  --star3:${({ theme }) => theme.light.colors.stars[3]};
  --star4:${({ theme }) => theme.light.colors.stars[4]};
  --star5:${({ theme }) => theme.light.colors.stars[5]};
  --qwiket-border-stale:${({ theme }) => theme.light.colors.qwiketBorderStale};
  --qwiket-border-recent:${({ theme }) => theme.light.colors.qwiketBorderRecent};
  --qwiket-border-new:${({ theme }) => theme.light.colors.qwiketBorderNew};

`;
const darkValues = css`
  --text: ${({ theme }) => theme.dark.colors.text};
  --background: ${({ theme }) => theme.dark.colors.background};
  --highBackground: ${({ theme }) => theme.dark.colors.highBackground};
  --link: ${({ theme }) => theme.dark.colors.link};
  --highlight: ${({ theme }) => theme.dark.colors.highlight};
  --lowlight: ${({ theme }) => theme.dark.colors.lowlight};
  --button: ${({ theme }) => theme.dark.colors.button};
  --notificationButton: ${({ theme }) => theme.dark.colors.notificationButton};
  
  --star1:${({ theme }) => theme.dark.colors.stars[1]};
  --star2:${({ theme }) => theme.dark.colors.stars[2]};
  --star3:${({ theme }) => theme.dark.colors.stars[3]};
  --star4:${({ theme }) => theme.dark.colors.stars[4]};
  --star5:${({ theme }) => theme.dark.colors.stars[5]};

  --qwiket-border-stale:${({ theme }) => theme.dark.colors.qwiketBorderStale};
  --qwiket-border-recent:${({ theme }) => theme.dark.colors.qwiketBorderRecent};
  --qwiket-border-new:${({ theme }) => theme.dark.colors.qwiketBorderNew};

`;

const GlobalStyle = createGlobalStyle`
  html,
  body {
    ${lightValues}
    
    @media (prefers-color-scheme: dark) {
        ${darkValues}
    }

    [data-theme="light"] {
        ${lightValues}
    }
    [data-theme="dark"] {
        ${darkValues}
    }  
    
    background-color:var(--background) !important;
    color:var(--text);
    padding: 0;
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
  figure {
    display: block;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
  
`
export default GlobalStyle
