import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Image from 'next/image'
import { fetchUser,getOnlineCount,unpublish } from '../../lib/lake-api';
import Lowline from './lowline';
import { UilGlassMartiniAlt,UilUsersAlt } from '@iconscout/react-unicons'
import { Playfair_Display } from '@next/font/google';
import { useAppContext } from "../../lib/context";
import {Star} from "../widgets/star"

//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';

//import navMenu from '../qwiket-lib/lib/navMenu'
//import { ClickWalledGarden } from '../qwiket-lib/components/walledGarden';
//import { logout } from '../qwiket-lib/actions/user';


import { UilStar } from '@iconscout/react-unicons'
import { UilNewspaper } from '@iconscout/react-unicons'
import axios from 'axios';
//import { UisStar } from '@iconscout/react-unicons'
const UisStar = UilStar;
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400',], style: ['normal'] })
const TitleStyledWrapper = styled.div`
display:flex;
width:100%;
align-items:center;
//font-family: Playfair Display !important;
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

const Title = styled.div`
    font-size:1.6rem;
    text-align:center;
    margin-left:30px;
    margin-right:30px;
    @media(min-width:600px){
        font-size:1.4rem;
    }
    @media(min-width:900px){
        font-size:${(params)=>{console.log("len=",params.len);return +params.len>20?'1.9':'2.2'}}rem;
    }
    @media(min-width:1000px){
        font-size:${(params)=>{console.log("len=",params.len);return +params.len>20?'2.4':'2.7'}}rem;
    }
    @media(min-width:1200px){
        font-size:${(params)=>{console.log("len=",params.len);return +params.len>20?'2.9':'3.7'}}rem;
    }
    @media(min-width:1400px){
        font-size:${(params)=>{console.log("len=",params.len);return +params.len>20?'3.5':'4.5'}}rem;
    }
    @media(min-width:1800px){
        font-size:${(params)=>{console.log("len=",params.len);return +params.len>20?'3.9':'4.8'}}rem;
    }
    @media(min-width:2100px){
        font-size:4.0rem;
    }
`

const TitleBand = ({ title, leftLogo, rightLogo }) => {

    if(!rightLogo)
    rightLogo=leftLogo;
    console.log("rightLogo:",rightLogo)
    return <Link href="/"><TitleStyledWrapper>
        <Logo src={leftLogo} /><Title len={title.length} className={playfair.className}>{title.toUpperCase()}</Title>{rightLogo ? <Logo src={rightLogo||leftLogo} /> : null}
    </TitleStyledWrapper></Link>
}

const StyledWrapper = styled.div`
display:flex;
//height:120px;
width:100%;
align-items:center;
//font-family: Playfair Display !important;
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
    margin-left:6px;
    margin-right:6px;
`
const SubTitle = styled.div`
    display:flex;
    font-size:0.9rem;
    text-align:center;
    margin-left:4px;
    margin-right:4px;

    @media(min-width:900px){
        font-size:1.2rem;
    }
    @media(min-width:1200px){
        font-size:1.2rem;
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
const SubscriberStar = styled.div``


const AvatarGroup = styled.div`
        display:flex;
        align-items:flex-begin;
     `
const Dateline = styled.div`
display:flex;
    font-size:0.7rem;
    color:#808080;
    //margin-left:20px;
`
const Martini = styled.div`
    margin-left:30px;
    margin-top:2px;
`
const OnlineCount = styled.div`
  
    margin-top:-2px;
    font-size:9px;
`
const OnlineCountIcon = styled.div`
  
    margin-left:0px;
    margin-top:2px;
`

const Home = styled.div`
    margin-right:30px;
    margin-top:2px;
`
const VerticalWrap = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`
const Unpublish=styled.span`
margin-left:40px;
`
const login = async (href) => {
    await axios.get(`/api/session/login?href=${encodeURIComponent(href)}`)

}

const StarContainer=styled.div`
    margin-top:-4px;
`
const logout =  (updateSession) =>  updateSession({ userslug: '' })
const DatelineBand = ({ channelSlug, channelDetails, user, updateSession }) => {
    const [hasUnpublish,setHasUnpublish]=useState(false)
    let subscr_status = +user?.subscr_status||0;
    useEffect(() => {
       if(subscr_status==5){
            console.log("subscr_status==5")
            setHasUnpublish(true);
       }
      }, [subscr_status]);
    
    const { session, qparams } = useAppContext();
    console.log('qparams',qparams)
    const countKey={sessionid:session.sessionid,userslug:session.userslug};
    const { data: count, error: countError } = useSWR(qparams.isbot?null:countKey, getOnlineCount,{refreshInterval:10000})
    //console.log({ subscr_status })
    const router = useRouter();

   

    //console.log('DATELINE FFuser:', user, updateSession)

    const { hometown, lacantinaUrl } = channelDetails;
    let channel = channelSlug;
    //console.log("channel:", channel, hometown, lacantinaUrl)
    // console.log("CHANNEL:", channel)

    const time = qparams.timestamp;
    var date = new Date(time * 1000);
    //let date = new Date(time);
    let dateStrging = date.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium" })//date.toDateString();
    let name = user?.user_name;
    let approver = user?.approver;
    let avatar = user?.avatar;
    console.log("subscr_status",subscr_status,approver)
    let isLoggedIn = user ? 1 : 0;
    //console.log("onlinecount=",count)
    const { setLoading } = useAppContext();
    //console.log('dateline',{ isLoggedIn,dateStrging,hometown })
    // return <div/> 
    //return<SubTitle>{`${dateStrging}  ${hometown}`}</SubTitle>
    return <StyledWrapper className={playfair.className}>
        <VerticalWrap>
            <HorizWrap><Dateline>{`${dateStrging} `} &nbsp;{`|`} &nbsp;
                                    <OnlineCountIcon><UilUsersAlt size="11" color="#888" /></OnlineCountIcon>
                                    <OnlineCount>{count?count:0} </OnlineCount>&nbsp;{`|`} {` ${hometown}`}</Dateline></HorizWrap>
             {false?<HorizWrap><AvatarGroup><Image src={avatar} width={32} height={32} />
             </AvatarGroup></HorizWrap> :null}

            {
                !isLoggedIn ? <SubTitle><Home><Link href={'/'}><UilNewspaper size="16" color="#888" /></Link></Home>
                    <Link onClick={() => setLoading("Logging-in via Disqus...")} href={`/api/session/login?href=${encodeURIComponent(router.asPath)}`}>Sign-in</Link>
                    &nbsp;|&nbsp; 
                   
                    
                    <a>Subscribe</a> 
                    <Link onClick={()=>console.log("lacantina click")} href={lacantinaUrl}><Martini><UilGlassMartiniAlt size="16" color="#888" /></Martini></Link>
                    </SubTitle> :
                    <HorizWrap>
                        <SubTitle><Home><Link href={'/'}><UilNewspaper size="16" color="#888" /></Link></Home>
                            <a onClick={() => logout(updateSession)}>
                                Sign Out
                            </a>
                        </SubTitle>
                        {+subscr_status==5 ?null: <SubTitle>
                            | 
                        </SubTitle>}
                        <SubTitle>  {`${isLoggedIn ? approver ? '[' + name + ']' : name : 'Subscribe'}`}<StarContainer><Star level={subscr_status} size={16}/></StarContainer>  
                       
                            <Link onClick={()=>console.log("lacantina click")} href={lacantinaUrl}>
                                <Martini>
                                    <UilGlassMartiniAlt size="16" color="#888" />
                                    {hasUnpublish?<Unpublish><Link onClick={async ()=>{await unpublish(qparams.threadid,qparams.tag);console.log("unpublish");}} href={'#'}><UilNewspaper size="16" color="red" /></Link></Unpublish>:null}
                 
                                </Martini>
                                
                            </Link>
                        </SubTitle>


                    </HorizWrap>
            }</VerticalWrap>
    </StyledWrapper >
}


const StyledHeader = styled.div`
width:100%;
`


export const Header = ({ session, layout, channelSlug, channelDetails, newsline, qparams, updateSession }) => {

    const { data: user, error: userError } = useSWR(['user', session.userslug], fetchUser)
    console.log('user:',user)
    // console.log("dark header render",session)
    // console.log("channelDetails",channelDetails)
    //  console.log({ newsline: newsline.toJS(), session: session.toJS() })

    return <StyledHeader className={playfair.classname}>
        <TitleBand title={`${newsline.slug != channelSlug ? `${channelDetails.shortname}:` : ''}${newsline.displayName}`} leftLogo={channelDetails.logo} rightLogo={newsline.logo} />
        <DatelineBand channelSlug={channelSlug} session={session} user={user} channelDetails={channelDetails} updateSession={updateSession} />
        <Lowline session={session} lowline={channelDetails.lowline} />
    </StyledHeader>
};

// <DesktopNavigation session={session} channelDetails={channelDetails} />