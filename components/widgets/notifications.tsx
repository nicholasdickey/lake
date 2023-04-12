import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { fetchNotificationsStatus } from '../../lib/lake-api';
import { useAppContext } from '../../lib/context';
import StyledCheckbox from './checkbox';
import { useEscapeKey } from '../../lib/use-esc-key'
import { Roboto } from '@next/font/google';
import Link from 'next/link'

import { useRouter } from 'next/router'
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
const publicVapidKey = 'BDLR35t7pZ7O5i3aGmLQA3_R54jofS9yvQl7JhyRVCTKE4cj0D_ixOSxxFAz6YC52jFEaI7bgxFfOg15Ub-nfUw';

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
const Loading = styled.div`
  
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  background-color:var(--background);
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  opacity:0.9;
  font-weight:700;
`
const Inner = styled.div`
padding:6px;
  background:var(--background);
  opacity:1.0;
  font-family:roboto;`
const Explain = styled.div`
  display:block;
  max-width:400px;  
  font-size:13px;
  margin-top:20px;
  margin-left:auto;
  margin-right:auto;
  margin-bottom:20px;
  overflow-wrap: break-word;
`
const HomeButton = styled.div`
    width:160px;
    font-size:13px;
    color:white;
    background:var(--notificationButton);
    margin-top:20px;
    text-align:center;
    margin-left:auto;
    margin-right:auto;
    cursor:pointer;
    padding:6px;
    
`
const Buttons = styled.div`
    margin-top:20px;
    display:flex;
    justify-content: space-between;
`
const Checkboxes = styled.div`
    display:block;
`
const Title = styled.div`
    
`
interface NotificationsStatus {
    subscribed: boolean;
    appBadge: {
        update: boolean;
        updateType: 'newsviews' | 'newsline' | 'comments';
    };
    threadResponses: boolean;
    commentResponses: boolean;
}
const Check = ({ label, checked, onChange, disabled }: { label: string, checked: boolean, disabled?: boolean, onChange: any }) => {
    return <StyledCheckbox className={roboto.className}
        onClick={() => onChange(disabled ? false : !checked)}
        label={label}
    >
        <input
            type="checkbox"
            name={label}
            checked={checked}
            onChange={onChange}
            disabled={disabled ? true : false}
        />
        <label htmlFor={label}>{label}</label>
    </StyledCheckbox>
}
export const NotificationsDialog = ({ user, closeDialog }: { user: any, closeDialog: any }) => {
    const { session, installPrompt, setLoading } = useAppContext();
    const [subscribed, setSubscribed] = useState(false);
    const [appBadgeUpdate, setAppBadgeUpdate] = useState(true);
    const [isApp, setIsApp] = useState(false);
    const [installClicked, setInstallClicked] = useState(false);
    const [appBadgeUpdateType, setappBadgeUpdateType] = useState('newsviews');
    const [threadResponse, setThreadResponse] = useState(true);
    const [commentResponses, setCommentResponses] = useState(true)

    const sessionid = session.sessionid;
    const { data: notificationsStatus, error: notificationsStatusError }: { data: NotificationsStatus, error: string | undefined } = useSWR({ sessionid }, fetchNotificationsStatus);
    const status = notificationsStatus || { subscribed: false, appBadge: { update: true, updateType: 'newsviews' }, threadResponses: true, commentResponses: true }
    const isLoggedIn = user ? true : false;
    const router = useRouter();
    useEffect(() => {
        if (status) {
            setSubscribed(status.subscribed);
        }
    }, [status]);

    useEffect(() => {
        if (window && window.matchMedia('(display-mode: standalone)').matches) {
            setIsApp(true);
        }
    }, []);
    useEscapeKey(() => close());
    console.log("isApp", isApp);
    return <Loading className={roboto.className}><Inner className={roboto.className}>
        <Title className={roboto.className}>{subscribed?'MANAGE':'ENABLE'} NOTIFICATIONS</Title>
        <Explain className={roboto.className}>Enable notifications for best experience. You will be able to fine tune the settings later.</Explain>
        {!isApp && !installClicked ? <div><Explain className={roboto.className}>Start by installing the page as a web application:</Explain>
            <HomeButton className={roboto.className} onClick={() => {
                setInstallClicked(true);
                installPrompt.prompt();
                /** Record click, set bugging state */
            }}>Add to Home Screen</HomeButton></div> : null}

        <Checkboxes><div><Check label='Place new notifications badge over app icon'

            checked={appBadgeUpdate}
            onChange={(checked: boolean) => {
                setAppBadgeUpdate(checked);
            }} /></div>
            <div><Check disabled={isLoggedIn ? false : true} label='Notify on replies to your comments'

                checked={threadResponse && isLoggedIn}
                onChange={(checked: boolean) => {
                    setThreadResponse(checked);
                }} /></div>
            <div>{isLoggedIn ? null : <Explain className={roboto.className}>
                <Link href={`/api/session/login?href=${encodeURIComponent(router.asPath)}`} legacyBehavior><a onClick={
                    async () => {
                        try {
                            setLoading("Logging-in via Disqus...")
                            window.location.href = `/api/session/login?href=${encodeURIComponent(router.asPath)}`;
                            //  await axios.get(`/api/session/login?href=${encodeURIComponent(router.asPath)}`);
                        }
                        catch (x) {
                            console.log("caught", x)
                        }
                        //alert("after login");
                    }
                } rel="nofollow">Login to enable Disqus notifications. Click here to sign-in.</a></Link>

            </Explain>}</div>
        </Checkboxes>
        <Buttons>
            <div><a className={roboto.className} onClick={() => { console.log("click close"); closeDialog() }}>Cancel</a></div>
            {!subscribed ? <div><a className={roboto.className} onClick={async () => {
                console.log("click enable");
                if ("serviceWorker" in navigator) {
                    // Supported!
                    const register = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                    console.log('Service worker successfully registered');

                    const subscription = await register.pushManager.subscribe({
                        userVisibleOnly: true,
                        //public vapid key
                        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                    });
                }
                closeDialog()
            }}>Enable</a></div> :
                <div><a className={roboto.className} onClick={() => {
                    console.log("click disable");
                    closeDialog()
                }}>Update</a></div>
            }
        </Buttons>

    </Inner> </Loading>
}