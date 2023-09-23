// ./components/navigation/header/title-band.tsx
import React from 'react'
import Link from 'next/link'
import styled from 'styled-components';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400',], style: ['normal'] })

const TitleStyledWrapper = styled.div`
display:flex;
width:100%;
align-items:center;
justify-content:center;
font-size:2rem;
`
interface TitleParams {
    len: number
}
const Title = styled.div<TitleParams>`
    font-size:1.6rem;
    text-align:center;
    margin-left:30px;
    margin-right:30px;
  
    @media(min-width:600px){
        font-size:1.4rem;   
    }
    @media(min-width:900px){
        font-size:${({ len }) => +len > 20 ? '1.9' : '2.2'}rem;
    }
    @media(min-width:1000px){
        font-size:${({ len }) => +len > 20 ? '2.4' : '2.7'}rem;
    }
    @media(min-width:1200px){
        font-size:${({ len }) => len > 20 ? '2.9' : '3.7'}rem;
    }
    @media(min-width:1400px){
        font-size:${({ len }) => +len > 20 ? '3.5' : '4.5'}rem;
    }
    @media(min-width:1800px){
        font-size:${({ len }) => +len > 20 ? '3.9' : '4.8'}rem;
    }
    @media(min-width:2100px){
        font-size:4.0rem;
    }
`
const Logo = styled.img`
    display:none;
    margin-left:10px;
    margin-right:10px;
    
    @media(min-width:600px){
        display:block;
        width:70px;
        height:70px;
    }
    @media(min-width:900px){
        display:block;
         width:90px;
        height:90px;
    }

    @media(min-width:1200px){
        display:block;
        width:90px;
        height:90px;
    }
   
    @media(min-width:1800px){
        display:block;
        width:120px;
        height:120px;
    }
    @media(min-width:2100px){
        display:block;
        width:140px;
        height:140px;
    }
`
interface TitleBandParams {
    title: string
    leftLogo: string
    rightLogo: string
}
const TitleBand = ({ title, leftLogo, rightLogo }: TitleBandParams) => {
    if (!rightLogo)
        rightLogo = leftLogo;

    return <Link href="/"><TitleStyledWrapper>
        <Logo src={leftLogo} /><Title len={title.length} className={playfair.className}>{title.toUpperCase()}</Title>{rightLogo ? <Logo src={rightLogo || leftLogo} /> : null}
    </TitleStyledWrapper></Link>
}
export default TitleBand;