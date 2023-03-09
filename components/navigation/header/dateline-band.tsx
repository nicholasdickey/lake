// ./components/navigation/header/dateline-band.tsx
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components';
import { useAppContext } from "../../../lib/context";
import { getOnlineCount, unpublish } from '../../../lib/lake-api';
import { UilGlassMartiniAlt, UilUsersAlt } from '@iconscout/react-unicons';
import { Playfair_Display } from '@next/font/google';
import Image from 'next/image';
import { Star } from "../../widgets/star"
import { UilNewspaper } from '@iconscout/react-unicons'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400',], style: ['normal'] });

const StyledWrapper = styled.div`
    display:flex;
    width:100%;
    align-items:center;
    justify-content:space-around;
    font-size:1.8rem;

    & a{
        cursor:pointer;
        text-decoration:none;
        color:var(--text));
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
const Unpublish = styled.span`
    margin-left:40px;
`
const StarContainer=styled.div`
    margin-top:-4px;
`
const logout = (updateSession:any) => updateSession({ userslug: '' })
interface DatelineBandParams{
    channelDetails:any,
    user:any,
    updateSession:any
}
const DatelineBand = ({channelDetails, user, updateSession }:DatelineBandParams) => {
    const [hasUnpublish, setHasUnpublish] = useState(false)
    let subscr_status = +user?.subscr_status || 0;
    useEffect(() => {
        if (subscr_status == 5) {
            setHasUnpublish(true);
        }
    }, [subscr_status]);

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
                    <Link onClick={() => setLoading("Logging-in via Disqus...")} href={`/api/session/login?href=${encodeURIComponent(router.asPath)}`}>Sign-in</Link>
                    &nbsp;|&nbsp;


                    <a>Subscribe</a>
                    <Link  href={lacantinaUrl}><Martini><UilGlassMartiniAlt size="16" color="#888" /></Martini></Link>
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
                            <Link  href={lacantinaUrl}>
                                <Martini>
                                    <UilGlassMartiniAlt size="16" color="#888" />
                                    {hasUnpublish ? <Unpublish><Link onClick={async () => { await unpublish(qparams.threadid, qparams.tag); console.log("unpublish"); }} href={'#'}><UilNewspaper size="16" color="red" /></Link></Unpublish> : null}

                                </Martini>
                            </Link>
                        </SubTitle>
                    </HorizWrap>
            }</VerticalWrap>
    </StyledWrapper >
}
 export default DatelineBand
