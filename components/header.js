import React from 'react'
import styled from 'styled-components';
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Image from 'next/image'
import { fetchUser } from '../lib/lakeApi';
import Lowline from './lowline';
import { UilGlassMartiniAlt } from '@iconscout/react-unicons'

import { useAppContext } from "../lib/context";

//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';

//import navMenu from '../qwiket-lib/lib/navMenu'
//import { ClickWalledGarden } from '../qwiket-lib/components/walledGarden';
//import { logout } from '../qwiket-lib/actions/user';


import { UilStar } from '@iconscout/react-unicons'
import { UilNewspaper } from '@iconscout/react-unicons'
//import { UisStar } from '@iconscout/react-unicons'
const UisStar = UilStar;
const TitleStyledWrapper = styled.div`
display:flex;
width:100%;
align-items:center;
font-family: Playfair Display !important;
justify-content:center;
font-size:2rem;

/*@media(max-width:749px){
    display:none;
}*/

`
/*const Logo = styled((props) => {
    return <img  {...props} />
})`
    width:60px;
    height:60px;
    margin-left:30px;
    margin-right:30px;
    @media(min-width:900px){
         width:40px;
        height:40px;
    }
    @media(min-width:1000px){
         width:50px;
        height:50px;
    }

    @media(max-width:1200px){
        width:60px;
        height:60px;
    }
    @media(max-width:1800px){
        width:90px;
        height:90px;
    }
    @media(min-width:1800px){
        width:120px;
        height:120px;
    }
    @media(min-width:2100px){
        width:140px;
        height:140px;
    }
`*/
const Logo = styled((props) => {
    return <img  {...props} />
})`
    display:none;
    margin-left:30px;
    margin-right:30px;
    @media(min-width:600px){
        display:block;
         width:40px;
        height:40px;
    }
    @media(min-width:1000px){
        display:block;
         width:50px;
        height:50px;
    }

    @media(min-width:1200px){
        display:block;
        width:60px;
        height:60px;
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
const Title = styled.div`
    font-size:1.6rem;
    text-align:center;
    margin-left:30px;
    margin-right:30px;
    @media(min-width:600px){
        font-size:1.4rem;
    }
    @media(min-width:900px){
        font-size:2.2rem;
    }
    @media(min-width:1000px){
        font-size:2.7rem;
    }
    @media(min-width:1200px){
        font-size:3.7rem;
    }
    @media(min-width:1400px){
        font-size:4.5rem;
    }
    @media(min-width:1800px){
        font-size:5.4rem;
    }
    @media(min-width:2100px){
        font-size:6.0rem;
    }
`
const TitleBand = ({ title, leftLogo, rightLogo }) => {


    return <Link href="/"><TitleStyledWrapper>
        <Logo src={leftLogo} /><Title>{title.toUpperCase()}</Title>{rightLogo ? <Logo src={rightLogo} /> : null}
    </TitleStyledWrapper></Link>
}

const StyledWrapper = styled.div`
display:flex;
//height:120px;
width:100%;
align-items:center;
font-family: Playfair Display !important;
justify-content:space-around;
font-size:1.8rem;
/*@media(max-width:749px){
    display:none;
}*/
& a{
cursor:pointer;
text-decoration:none;
color:${props => props.theme.color};
}
& a:hover{
    font-weight:500;
    color:var(--link);
}

`

const HorizWrap = styled.div`
    display:flex;
    justify-content:flex-start;
    margin-left:40px;
    margin-right:40px;
`
const SubTitle = styled.div`
    display:flex;
    font-size:1.2rem;
    text-align:center;
    margin-left:10px;
    margin-right:10px;
    @media(min-width:1200px){
        font-size:1.3rem;
    }
    @media(min-width:1400px){
        font-size:1.4rem;
    }
    @media(min-width:1800px){
        font-size:1.5rem;
    }
    @media(min-width:2100px){
        font-size:1.6rem;
    }
`
const SubscriberStar = styled((startColor, ...props) => <UisStar style={{ color: starColor, marginTop: -4, marginLeft: 4 }} {...props} />)

const AvatarGroup = styled.div`
        display:flex;
        align-items:flex-begin;
     `
const Dateline=styled.div`
    font-size:0.7rem;
    color:#808080;
    //margin-left:20px;
`     
const Martini=styled.div`
    margin-left:30px;
    margin-top:2px;
`
const Home=styled.div`
    margin-right:30px;
    margin-top:2px;
`
const VerticalWrap=styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`

const DatelineBand = ({ channelSlug, session, channelDetails, user }) => {

    let subscr_status = +user?.subscr_status;
    if (!subscr_status)
        subscr_status = 0;
    //console.log({ subscr_status })


    const {  qparams } = useAppContext();



    let hometown = channelDetails.hometown;
    let channel = channelSlug;
    // console.log("CHANNEL:", channel)
   
    const time=qparams.timestamp;
    var date = new Date(time * 1000);
    //let date = new Date(time);
    let dateStrging = date.toLocaleString("en-US", {timeZone: "America/Chicago",dateStyle:"medium"})//date.toDateString();
    let name = user?.user_name;
    let approver = user?.approver;
    let avatar = user?.avatar;

    let isLoggedIn = user ? 1 : 0;
    //console.log('dateline',{ isLoggedIn,dateStrging,hometown })
   // return <div/> 
    //return<SubTitle>{`${dateStrging}  ${hometown}`}</SubTitle>
    return <StyledWrapper>
        <VerticalWrap>
            <HorizWrap><Dateline>{`${dateStrging} | ${hometown}`}</Dateline></HorizWrap>
            {isLoggedIn ? <HorizWrap><AvatarGroup><Image src={avatar} width={32} height={32} />{subscr_status > 0 ? <SubscriberStar /> : null}</AvatarGroup></HorizWrap> : null}

        {
            !isLoggedIn ? <SubTitle><Home><Link href={'/'}><UilNewspaper size="16" color="#888"/></Link></Home><a>Sign-in</a>&nbsp;|&nbsp; <a>Subscribe</a> <Martini><a><UilGlassMartiniAlt size="16" color="#888" /></a></Martini></SubTitle>:
                <HorizWrap>
                    <SubTitle>
                        <a onClick={() => { console.log("sign out:", `/disqus-logout?channel=${channel}`); window.location = `/channel/${channel}?logout=1` }}>
                            Sign Out
                        </a>
                    </SubTitle>
                    {!approver ? <SubTitle>
                        |
                    </SubTitle> : null}
                    <SubTitle> {`${isLoggedIn ? approver ? '[' + name + ']' : name : 'Subscribe'}`}</SubTitle>


                </HorizWrap>
        }</VerticalWrap>
    </StyledWrapper >
}


const StyledHeader = styled.div`
width:100%;
`


export const Header = ({ session, layout, channelSlug, channelDetails, newsline, qparams, updateSession }) => {

    const { data: user, error: userError } = useSWR(['user', session.userslug], fetchUser)
    // console.log("dark header render",session)
    // console.log("channelDetails",channelDetails)
    //  console.log({ newsline: newsline.toJS(), session: session.toJS() })

    return <StyledHeader>
        <TitleBand title={`${newsline.slug != channelSlug ? `${channelDetails.shortname}:` : ''}${newsline.displayName}`} leftLogo={channelDetails.logo} rightLogo={newsline.logo} />
        <DatelineBand channelSlug={channelSlug} session={session} user={user} channelDetails={channelDetails} updateSession={updateSession} />
        <Lowline session={session} lowline={channelDetails.lowline} />
    </StyledHeader>
};

// <DesktopNavigation session={session} channelDetails={channelDetails} />