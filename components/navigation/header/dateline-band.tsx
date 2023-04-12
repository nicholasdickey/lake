// ./components/navigation/header/dateline-band.tsx
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'
import styled from 'styled-components';
import { useAppContext } from "../../../lib/context";
import { getOnlineCount, unpublish } from '../../../lib/lake-api';
import { UilGlassMartiniAlt, UilUsersAlt } from '@iconscout/react-unicons';
import { Playfair_Display } from '@next/font/google';
import Image from 'next/image';
import { Star } from "../../widgets/star";
import { UilNewspaper } from '@iconscout/react-unicons';
import { UilBell } from '@iconscout/react-unicons'
import { NotificationsDialog } from "../../widgets/notifications";

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
    justify-content:space-between;
    align-items:start;
    margin-left:0px;
    margin-right:0px;
    
`
const SubTitle = styled.div`
    display:flex;
    font-size:0.9rem;
    text-align:center;
    vertical-align:middle;
    margin-left:4px;
    margin-right:4px;
    white-space: nowrap;

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
    margin-left:4px;
    margin-top:2px;
    color:var(--notificationButton);
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
    margin-right:10px;
    margin-top:2px;
    color:var(--notificationButton);
`
const VerticalWrap = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
`
const Unpublish = styled.span`
    margin-left:4px;
`
const StarContainer = styled.div`
    margin-top:-4px;
`
const BellContainer = styled.div`
    margin-top:2px;
    width:24px;
    height:24px;
    display:block;
    opacity:1.0;
    color:var(--notificationButton);

`
const logout = (updateSession: any) => updateSession({ userslug: '' })
interface DatelineBandParams {
    channelDetails: any,
    user: any,
    updateSession: any,
    notif: string
}
const DatelineBand = ({ channelDetails, user, updateSession, notif }: DatelineBandParams) => {
    const [hasUnpublish, setHasUnpublish] = useState(false);
    //const [openedNotificationsDialog, openNotificationsDialog] = useState(false);


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
        <VerticalWrap>{notif ? <NotificationsDialog user={user} closeDialog={() => { console.log("set false"); router.push(router.asPath.split('?')[0]) }} /> : null}
            <HorizWrap><Dateline>{`${dateStrging} `} &nbsp;{`|`} &nbsp;
                <OnlineCountIcon><UilUsersAlt size="11" color="#888" /></OnlineCountIcon>
                <OnlineCount>{count ? count : 0} </OnlineCount>&nbsp;{`|`} {` ${hometown}`}</Dateline></HorizWrap>
            {false ? <HorizWrap><AvatarGroup><Image src={avatar} width={32} height={32} alt='Logo' />
            </AvatarGroup></HorizWrap> : null}
            {
                !isLoggedIn ?

                    <HorizWrap>
                        <SubTitle><Home><Link href={'/'}><UilNewspaper size={16} /></Link></Home>
                        </SubTitle>
                        <SubTitle>
                            <Link href={`/api/session/login?href=${encodeURIComponent(router.asPath)}`} legacyBehavior><a onClick={
                                async () => {
                                    try {
                                        setLoading("Logging-in via Disqus...")
                                        window.location.href = `/api/session/login?href=${encodeURIComponent(router.asPath)}`;
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
                            } rel="nofollow">Sign-in</a>
                            </Link>
                        </SubTitle>

                        {false ? <span>&nbsp;|&nbsp;<a>Subscribe</a></span> : null}

                        <SubTitle>
                            <BellContainer> <a onClick={() => {
                                router.push(router.asPath.indexOf('notif') < 0 ?
                                    router.asPath + '?notif=1' : router.asPath)
                            }}><UilBell size={16} /></a>
                            </BellContainer>
                        </SubTitle>
                        <SubTitle>
                            <Link href={lacantinaUrl}><Martini><UilGlassMartiniAlt size={16} /></Martini></Link>
                        </SubTitle>
                    </HorizWrap> :
                    <HorizWrap>
                        <SubTitle>
                            <Home><Link href={'/'}><UilNewspaper size={16}/></Link></Home>
                        </SubTitle>
                        <SubTitle>
                            <a rel="nofollow" onClick={() => logout(updateSession)}>
                                Sign-out
                            </a>
                        </SubTitle>
                        <SubTitle>
                            |
                        </SubTitle>
                        <SubTitle>  {`${isLoggedIn ? approver ? '[' + name + ']' : name : 'Subscribe'}`}<StarContainer><Star level={subscr_status} size={16} /></StarContainer>
                            <span>&nbsp;|&nbsp;</span>
                        </SubTitle>
                        <SubTitle>
                            <BellContainer> <a onClick={() => {
                                router.push(router.asPath + '?notif=1')

                            }}><UilBell size={16} /></a></BellContainer>
                        </SubTitle>
                        <SubTitle>
                            <Martini>
                                <Link href={lacantinaUrl}><UilGlassMartiniAlt size={16} /></Link></Martini>
                        </SubTitle>
                        <SubTitle> {hasUnpublish ? <Unpublish><Link onClick={async () => { await unpublish(qparams.threadid, qparams.tag); console.log("unpublish"); }} href={'#'}><UilNewspaper size="16" color="red" /></Link></Unpublish> : null}
                        </SubTitle>
                    </HorizWrap>
            }</VerticalWrap>
    </StyledWrapper >
}
export default DatelineBand
