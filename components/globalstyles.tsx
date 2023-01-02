import { createGlobalStyle, css } from 'styled-components'

const lightValues = css`
  --text: ${({ theme }) => theme.light.colors.text};
  --background: ${({ theme }) => theme.light.colors.background};
  --link: ${({ theme }) => theme.light.colors.link};
  --button: ${({ theme }) => theme.light.colors.button};
  --star1:${({ theme }) => theme.light.colors.stars[1]};
  --star2:${({ theme }) => theme.light.colors.stars[2]};
  --star3:${({ theme }) => theme.light.colors.stars[3]};
  --star4:${({ theme }) => theme.light.colors.stars[4]};
  --star5:${({ theme }) => theme.light.colors.stars[5]};
`;
const darkValues = css`
  --text: ${({ theme }) => theme.dark.colors.text};
  --background: ${({ theme }) => theme.dark.colors.background};
  --link: ${({ theme }) => theme.dark.colors.link};
  --button: ${({ theme }) => theme.dark.colors.button};
  --star1:${({ theme }) => theme.dark.colors.stars[1]};
  --star2:${({ theme }) => theme.dark.colors.stars[2]};
  --star3:${({ theme }) => theme.dark.colors.stars[3]};
  --star4:${({ theme }) => theme.dark.colors.stars[4]};
  --star5:${({ theme }) => theme.dark.colors.stars[5]};
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
  
  
`
/*
:root{
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
    background-color:var(--background);
  }
  */
export default GlobalStyle
/*
:root {
    ${lightValues}
    [data-theme="dark"] {
      ${darkValues}
    }
    &.no-js {
      @media (prefers-color-scheme: dark) {
        ${darkValues}
      }
    }
  }
  */