// ./components/navigation/lowline.tsx
import React from 'react'
import styled from 'styled-components';
import { UilStar } from '@iconscout/react-unicons'
import {Options} from '../../lib/with-session';

interface LowlineWrapperParams {
    loud: number,
    band: number,
}
const LowlineWrapper = styled.div<LowlineWrapperParams>`
    display: flex;
    margin-top: 10px;
    margin-bottom:16px;
    ${({loud})=>loud?'border-top: thin solid var(--text);':
     '@media (min-width:600px) {border-top: thin solid var(--text);}'}
    
    height: 30px;
    border-bottom: ${({loud,band}) => !loud && band==1 ? null : 'thin solid var(--text)'};
    width: 100%;
    align-items: center;
    font-family: Roboto;
    justify-content: center;
    font-size: 0.9rem;
    @media(max-width: 500px) {      
        font-size: 9px;
    } `
const Phone = styled.div`
    display: none;
    width:100%;
    justify-content: center;
    min-width:110px;
    @media(min-width: 50px) {
        display: flex;
    }
    @media(min-width: 500px) {
        display: none;
    }
    `

const HorizontalPhone = styled.div`
    display: none;
    @media(min-width: 500px) {
        display: flex;
    }
    @media(min-width: 600px) {
        display: none;
    }
    `
const VerticalTablet = styled.div`
    display: none;
    @media(min-width: 600px) {
        display: flex;
    }
    @media(min-width: 900px) {
        display: none;
    }
    `
const HorizontalTablet = styled.div`
    display: none;
    @media(min-width: 900px) {
        display: flex;
    }
    @media(min-width: 1199px) {
        display: none;
    }
    `
const SmallDesktop = styled.div`
    display: none;
    @media(min-width: 1200px) {
        display: flex;
    }
    @media(min-width: 1799px) {
        display: none;
    }
    `
const LargeDesktop = styled.div`
    display: none;
    @media(min-width: 1800px) {
        display: flex;
    }
    `
const Stars = styled.div`
    flex-shrink: 0;
    width: 60px;
    margin-right: 30px;
    margin-left: 30px;
    display:flex;
    `
const Star = styled(UilStar)`
    font-size: 10px;
    margin-left: 10px;
    width:1-p;overflow-x;
    height:10px;
    `

const Lowline = ({ session, lowline }:{session:Options,lowline:any}) => {
    return <LowlineWrapper loud={session.loud} band={session.band}>
        <Stars>
            <Star />
            <Star />
            <Star />
        </Stars>
        <Phone>{lowline.phone}</Phone>
        <HorizontalPhone>{lowline.horizontalPhone}</HorizontalPhone>
        <VerticalTablet>{lowline.verticalTablet}</VerticalTablet>
        <HorizontalTablet>{lowline.horizontalTablet}</HorizontalTablet>
        <SmallDesktop>{lowline.smallDesktop}</SmallDesktop>
        <LargeDesktop>{lowline.largeDestop}</LargeDesktop>
        <Stars>
            <Star />
            <Star />
            <Star />
        </Stars>
    </LowlineWrapper>
}
export default Lowline;