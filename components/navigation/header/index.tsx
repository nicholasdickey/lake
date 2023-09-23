// ./components/navigtation/header/index.tsx
import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import useSWR from 'swr';
import { fetchUser,getOnlineCount,unpublish } from '../../../lib/lake-api';
import Lowline from '../lowline';
import { Playfair_Display } from 'next/font/google';
import { useAppContext } from "../../../lib/context";

import TitleBand from './title-band';
import DatelineBand from './dateline-band';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400',], style: ['normal'] });
const StyledHeader = styled.div`
    width:100%;
`
export interface HeaderProps{
    channelSlug:string,
    channelDetails:any,
    newsline:any,
    updateSession:any
}
export const Header = ({ channelSlug, channelDetails, newsline, updateSession }:HeaderProps) => {
    const { session } = useAppContext();
    const { data: user, error: userError } = useSWR(['user', session.userslug], fetchUser)
    return <StyledHeader className={playfair.className}>
        <TitleBand title={`${newsline.slug != channelSlug ? `${channelDetails.shortname}:` : ''}${newsline.displayName}`} leftLogo={channelDetails.logo} rightLogo={newsline.logo} />
        <DatelineBand  user={user} channelDetails={channelDetails} updateSession={updateSession} />
        <Lowline session={session} lowline={channelDetails.lowline} />
    </StyledHeader>
};