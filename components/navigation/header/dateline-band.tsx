// ./components/navigation/header/dateline-band.tsx
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'
import styled from 'styled-components';
import { useAppContext } from "../../../lib/context";
import { getOnlineCount, unpublish } from '../../../lib/lake-api';
import { UilGlassMartiniAlt, UilUsersAlt,UilSpoonAlt } from '@iconscout/react-unicons';
import { Playfair_Display } from '@next/font/google';
import Image from 'next/image';
import { Star } from "../../widgets/star"
import { UilNewspaper } from '@iconscout/react-unicons'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400',], style: ['normal'] });

const StyledWrapper = styled.div`
    display:flex;
    width:100%;
    //margin-top:-10px;
    align-items:center;
    justify-content:space-around;
    font-size:1.8rem;
    @media(min-width:600px){
        font-size:1.4rem;
        margin-top:-20px;
    }
    & a{
        cursor:pointer;
        text-decoration:none;
        color:var(--text);
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
const AvatarGroup = styled.div`
    display:flex;
    align-items:flex-begin;
    `
const Dateline = styled.div`
    display:flex;
    font-size:0.7rem;
    color:#808080;
`
const Martini = styled.div`
    margin-left:10px;
    margin-top:2px;
    color:#888; 
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
const Unpublish = styled.span`
    margin-left:10px;
`
const StarContainer = styled.div`
    margin-top:-4px;
`
const Icons = styled.div`
    display:flex;
    margin-left:10px;
    //align-items:center;
    //justify-content:center;
    `;
const logout = (updateSession: any) => updateSession({ userslug: '' })
interface DatelineBandParams {
    channelDetails: any,
    user: any,
    updateSession: any
}
const DatelineBand = ({ channelDetails, user, updateSession }: DatelineBandParams) => {
    const [hasUnpublish, setHasUnpublish] = useState(false)
    let subscr_status = +user?.subscr_status || 0;
    useEffect(() => {
        if (subscr_status == 5) {
            setHasUnpublish(true);
        }
    }, [subscr_status]);
    console.log('channelDetails', channelDetails)
    const { session, qparams } = useAppContext();
    const countKey = { sessionid: session.sessionid, userslug: session.userslug };
    const { data: count, error: countError } = useSWR(qparams.isbot ? null : countKey, getOnlineCount, { refreshInterval: 10000 })
    const router = useRouter();

    const { hometown, lacantinaUrl } = channelDetails;


    const time = qparams.timestamp;
    var date = new Date(time * 1000);

    let dateStrging = date.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium" })//date.toDateString();
    let name = user?.user_name;
    let approver = user?.approver;
    let avatar = user?.avatar;

    let isLoggedIn = user ? 1 : 0;

    const { setLoading } = useAppContext();

    return <StyledWrapper className={playfair.className}>
        <VerticalWrap>
            <HorizWrap><Dateline>{`${dateStrging} `} &nbsp;{`|`} &nbsp;
                <OnlineCountIcon><UilUsersAlt size="11" color="#888" /></OnlineCountIcon>
                <OnlineCount>{count ? count : 0} </OnlineCount>&nbsp;{`|`} {` ${hometown}`}</Dateline></HorizWrap>
            {false ? <HorizWrap><AvatarGroup><Image src={avatar} width={32} height={32} alt='Logo' />
            </AvatarGroup></HorizWrap> : null}
            {
                !isLoggedIn ? <SubTitle><Home><Link href={'/'}><UilNewspaper size="16" color="#888" /></Link></Home>
                    <Link href={`/api/session/login?href=${encodeURIComponent(router.asPath)}`} legacyBehavior><a onClick={
                        async () => {
                            try {
                                setLoading("Logging-in via Disqus...")
                                window.location.href=`/api/session/login?href=${encodeURIComponent(router.asPath)}`;
                              //  await axios.get(`/api/session/login?href=${encodeURIComponent(router.asPath)}`);

                            }
                            catch (x) {
                                console.log("caught", x)
                                try {
                                    await axios.get(`/api/session/login?href=${encodeURIComponent(router.asPath)}`);

                                }
                                catch (x) {
                                    console.log("retry caught", x)
                                }
                            }
                            //alert("after login");
                        }
                    } rel="nofollow">Sign-in</a></Link>
                    {false ? <span>&nbsp;|&nbsp;


                        <a>Subscribe</a></span> : null}
                    <Icons>
                        <Link href={lacantinaUrl}>
                            <Martini><UilGlassMartiniAlt size="16" />
                            </Martini>
                        </Link>
                    {channelDetails.slug=='qwiket'?
                        <Link href="/usconservative/topic/fq/6-slug-la-cocina-am1news">
                            <Martini><div style={{width:16,height:16}}><svg stroke="#888" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="spoon"><path d="M15.53,14.13a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l6.18,6.18a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41Zm1.23-2.49a3,3,0,0,0,2.12-.88l2.83-2.83a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L17.46,9.35a1,1,0,0,1-1.41,0l3.54-3.54a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L14.64,7.93h0a1,1,0,0,1,0-1.41l2.82-2.83a1,1,0,1,0-1.41-1.41L13.22,5.11a3,3,0,0,0,0,4.24h0L12,10.59,10.44,9.05a4.16,4.16,0,0,0-.74-5C8.26,2.61,4.53,1,2.77,2.79S2.6,8.27,4,9.72A4.36,4.36,0,0,0,6.94,11h.14A3.88,3.88,0,0,0,9,10.46L10.57,12,2.29,20.28a1,1,0,1,0,1.42,1.41l9-9,0,0,0,0,1.92-1.92A3,3,0,0,0,16.76,11.64ZM8.43,8.44A1.93,1.93,0,0,1,7,9,2.26,2.26,0,0,1,5.46,8.3C4.38,7.22,3.62,4.77,4.19,4.2A1,1,0,0,1,4.85,4,5.87,5.87,0,0,1,8.29,5.47,2.12,2.12,0,0,1,8.43,8.44Z"></path></svg></div> </Martini></Link>:null}
                    </Icons>   
                </SubTitle> :
                    <HorizWrap>
                        <SubTitle><Home><Link href={'/'}><UilNewspaper size="16" color="#888" /></Link></Home>
                            <a onClick={() => logout(updateSession)}>
                                Sign Out
                            </a>
                        </SubTitle>
                        {+subscr_status == 5 ? null : <SubTitle>
                            |
                        </SubTitle>}
                        <SubTitle>  {`${isLoggedIn ? approver ? '[' + name + ']' : name : 'Subscribe'}`}<StarContainer><Star level={subscr_status} size={16} /></StarContainer>
                            <Icons>
                            <Link href={lacantinaUrl}>
                                <Martini>
                                    <UilGlassMartiniAlt size="16"  />
                                </Martini> 
                            </Link> 
                            {channelDetails.slug=='qwiket'?
                            <Link href="/usconservative/topic/fq/6-slug-la-cocina-am1news"> <Martini><div style={{width:16,height:16}}><svg stroke="#888" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="spoon"><path d="M15.53,14.13a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l6.18,6.18a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41Zm1.23-2.49a3,3,0,0,0,2.12-.88l2.83-2.83a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L17.46,9.35a1,1,0,0,1-1.41,0l3.54-3.54a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L14.64,7.93h0a1,1,0,0,1,0-1.41l2.82-2.83a1,1,0,1,0-1.41-1.41L13.22,5.11a3,3,0,0,0,0,4.24h0L12,10.59,10.44,9.05a4.16,4.16,0,0,0-.74-5C8.26,2.61,4.53,1,2.77,2.79S2.6,8.27,4,9.72A4.36,4.36,0,0,0,6.94,11h.14A3.88,3.88,0,0,0,9,10.46L10.57,12,2.29,20.28a1,1,0,1,0,1.42,1.41l9-9,0,0,0,0,1.92-1.92A3,3,0,0,0,16.76,11.64ZM8.43,8.44A1.93,1.93,0,0,1,7,9,2.26,2.26,0,0,1,5.46,8.3C4.38,7.22,3.62,4.77,4.19,4.2A1,1,0,0,1,4.85,4,5.87,5.87,0,0,1,8.29,5.47,2.12,2.12,0,0,1,8.43,8.44Z"></path></svg></div>  </Martini></Link>:null}
               
                            {hasUnpublish ? <Unpublish><Link onClick={async () => { await unpublish(qparams.threadid, qparams.tag); console.log("unpublish"); }} href={'#'}><UilNewspaper size="16" color="red" /></Link></Unpublish> : null}
                            </Icons>
                                
                           
                        </SubTitle>
                    </HorizWrap>
            }</VerticalWrap>
    </StyledWrapper >
}
export default DatelineBand
