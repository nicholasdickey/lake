// ./components/item/qwiket/index.tsx
import React, { useState, useEffect, useCallback, ReactFragment, ReactNode } from "react";
import { useRouter } from 'next/router'
import styled from 'styled-components';
import NextImage from 'next/image';
import TimeDifference from '../../../lib/time-difference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppContext } from "../../../lib/context";
import Link from 'next/link'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Markdown from 'markdown-to-jsx'
import { BodySnatcher } from './body-snatcher';
import { Star } from '../../widgets/star'
import { RWebShare } from "react-web-share";
import { entityToHtml } from '../../../lib/entity-to-html';
/**
 * CSS
 */
const StarContainer = styled.div`
    margin-top:-4px;
`

interface IsTopic {
    isTopic: boolean,
    isTag?: boolean,
    diff?: number,
    singlePanel?: boolean,
    isRight?: boolean,
    fullPage?: boolean
}

const VerticalWrap = styled.div<IsTopic>`
    background:var(--background);
    border-color:${({ isTag, diff }) => (isTag && diff && (diff < 3600)) ? 'var(--qwiket-border-new) var(--qwiket-border-stale) var(--qwiket-border-new) var(--qwiket-border-new)' : isTag && diff && diff < 4 * 3600 ? 'var(--qwiket-border-recent) var(--qwiket-border-stale) var(--qwiket-border-recent) var(--qwiket-border-recent)' : 'var(--qwiket-border-stale)'};
    border-style: solid ${({ isTopic, singlePanel }) => isTopic ? singlePanel ? 'solid' : 'none' : 'solid'}  ${({ isTopic }) => isTopic ? 'none' : 'solid'}   ${({ isTopic }) => isTopic ? 'none' : 'solid'}  ;
    border-width:${({ isTopic }) => isTopic ? 1 : 1}px;
    cursor:pointer;
    padding-left:${({ isTopic }) => isTopic ? 8 : 8}px;
    padding-right:${({ isTopic }) => isTopic ? 8 : 6}px;
    padding-top:${({ fullPage }) => fullPage ? 16 : 6}px;
    width:100%;
   // padding-top:6px;
    margin-bottom:6px;
    h1 {
        font-size:18px;
        font-weight:400;
    }
    blockquote {
        border-left:4px solid grey;
        padding-left:16px;
        margin-left:6px;
    }
    border-right:${({ isRight }) => isRight ? 'solid 1px' : 'none'};
`

const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:4px;
    font-size:1.0rem;
    line-height:1.3;
    width:100%;
    text-overflow:ellipsis;
    overflow:hidden;
    p{
       text-overflow:ellipsis;
       overflow:hidden;
    }
    a{
        text-overflow:ellipsis;
        overflow:hidden;
     }    
`

const TopRow = styled.div`
    margin-bottom:5px;
`

const SiteName = styled.div<IsTopic>`
    font-size:${({ isTopic }) => isTopic ? 22 : 12}px;   
    margin-right:20px;
    margin-left:20px;
`

const Author = styled.div`
    margin-top:8px;
    font-size: 12px;   
    margin-right:4px;
`

const AuthorPoster = styled.div`
    font-size: 14px;   
`

const TimeSince = styled.div<IsTopic>`
    font-size:${({ isTopic }) => isTopic ? 14 : 10}px;
    margin-right:${({ isTopic }) => isTopic ? 0 : 4}px;   
`

const Title = styled.h1<IsTopic>`
    line-height: 1.2;
    font-size: ${({ isTopic }) => isTopic ? 1.6 : 1.1}rem;  
    text-align: left; 
    margin-top:4px;
    margin-bottom:4px; 
    width:100%;
    overflow-wrap:break-word;
`

const Description = styled.div`
    margin-bottom:2px;
`

interface ImageBoxProps {
    extraWide: boolean,
    loud: number,
    isTopic: boolean
}
const ImageBox = styled.div<ImageBoxProps>` 
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    max-height: 100% !important;
    margin: 4px auto 4px auto;
    height:${({ extraWide, loud, isTopic }) => isTopic ? '440' : extraWide ? loud ? '264' : '200' : loud ? '164' : '120'}px;
    width:100%;  
    background:#000;
    opacity:${({ loud }) => (loud == 1) ? 1.0 : 0.8};
`

interface PubImageProps {
    loud: number,
    isTopic: boolean
}
const PubImage = styled.img<PubImageProps>`
    position: relative;
    margin-top: ${({ isTopic }) => isTopic ? 6 : 16}px;
    padding-top: 0px;
    margin-right: 2px;
    height:${({ isTopic }) => isTopic ? 64 : 28}px;
    width:auto;
    opacity:${({ loud, isTopic }) => (loud || isTopic) ? 1.0 : .8};
    margin-bottom: 4px;
    max-width:${({ isTopic }) => isTopic ? 240 : 120}px;   
    @media(max-width:600px){
        max-width:${({ isTopic }) => isTopic ? 180 : 90}px; 
    }
`

const PubImageBox = styled.div`
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 0px;
`

const Avatar = styled.img`
    max-width: 38px;
    max-height: 38px;
    padding-top: 0px;
    margin-right: 16px;  
`

const AvatarBox = styled.div`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 16px;
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 10px;
    width:48px;
    height:48px;
`

const Body = styled.div`
    width:100%; 
    & .caption, .e-caption, .wp-caption-text{
        font-style:italic;
    }
    & iframe{
        min-height:450px;
    }
   

`
interface RightParams {
    length: number
}
const Right = styled.div<RightParams>`
    padding-top:${({ length }) => length > 14 ? 10 : 2}px;
    height:auto;
    display:flex;
    justify-content:space-between;
`

const Comment = styled.div`
    font-size:10px;
    font-weight: 700;
    border:solid grey 1px;
    padding:1px 3px 1px 3px;
    margin:1px 16px 1px 3px;
   
`

const TweetEmbedContainer = styled.div`
    width:100%;
    position:relative;
    margin-top:20px;
    margin-bottom:20px;
`

const TweetEmbed = styled.div`
    margin-left:auto;
    margin-right:auto;
    max-width:540px;
`

const Share = styled.div`
    margin-top:4px;
    margin-bottom:20px;
`

const Button = styled.button`
    margin-top:10px;
    padding:4px;
    background:green;
    color:white;
    cursor:pointer;
`

const PleaseRead = styled.p`
    color:var(--text);
    font-style: italic;
    opacity:0.8;
`
interface ModerateParams {
    flag: string;
}
const Moderate = styled.div<ModerateParams>`
    & img{
        display:${({ flag }) => flag == 'nopic' ? 'none' : 'block'};
    }
    & iframe{
        display:${({ flag }) => flag == 'nopic' ? 'none' : 'block'};
    }
`
const CallToShare = styled.div`
font-style: italic;
color:red;
cursor:initial;
`
const SeeMore = styled.div`
margin-bottom:60px;
//text-decoration: underline dotted ;
cursor:pointer;
`
const CallImage = styled.div`
top:2-px;
`
//--------------------

const Qwiket = ({ extraWide, isRight, item, isTopic, qType, singlePanel, fullPage, mutate, setAckOverride, channelName }: { extraWide: boolean, isRight: boolean, item: any, isTopic: boolean, qType?: string, singlePanel?: boolean, fullPage?: boolean, mutate?: any, setAckOverride?: any, channelName?: string }) => {

    const [openDialog, setOpenDialog] = useState(false);

    const isTag = qType == 'tag';

    const { session, qparams, newsline, channelDetails } = useAppContext();
    const isReact = item && typeof item.qpostid !== 'undefined' && item.qpostid;
    let { description, title } = item ? item : { description: '', title: '' };
    const descrParts = description.split("{ai:summary}");
    description = descrParts[0];
    let summary = descrParts.length > 1 ? descrParts[1] : '';
    if (summary.trim() == '[object Object]')
        summary = null;
    const homeLink = `/${qparams.forum}/home/${qparams.tag}`;
    const itemUrl = item.url ? item.url : '';

    const blur = 'https://ucarecdn.com/d26e44d9-5ca8-4823-9450-47a60e3287c6/al90.png';
    if (isTopic) {
        let { catIcon, catName, tag, image, site_name, published_time, author, body, hasBody, slug, headless }:
            { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string, body: any, hasBody?: boolean, ack?: boolean, headless?: number } =
            item ? item : { catIcon: '', catName: '', tag: '', image: '', site_name: '', published_time: '', author: '', body: '' };
        if (!image)
            image = blur;
        if (!catIcon)
            catIcon = blur;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = blur;
        }
        if (!title)
            title = 'Loading...';

        if (site_name) {
            site_name = site_name.split('|')[0];
            site_name = site_name.split(' - ')[0];
        }
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp)
        let bodyHtml: string = '';
        interface BodyBlock {
            type: string;
            content: string;
            id?: string;
        }
        let bodyBlocks: Array<ReactNode> | null = null;
        let AckBlock: ReactNode = null;
        if (body) {
            bodyBlocks = body.map((b: BodyBlock, i: number) => {
                return (b.type == "twitter" && b.id) ? <TweetEmbedContainer key={`twt-${i}`}><TweetEmbed><TwitterTweetEmbed tweetId={b.id} placeholder="Loading a Tweet..." /*options={{theme:session.dark?'dark':'light'}}*/ /></TweetEmbed></TweetEmbedContainer> : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{b.content}</ReactMarkdown>
            })
        }
        if (!body && hasBody) {

            AckBlock = <>{openDialog ? <BodySnatcher mutate={mutate} setAckOverride={setAckOverride} setOpenDialog={setOpenDialog} tag={tag} slug={slug} /> : <SeeMore><a onClick={() => setOpenDialog(true)}>See more....</a></SeeMore>}</>
        }
// <PleaseRead>Please click below to read the article on the original site before commenting:</PleaseRead>
           
        return <VerticalWrap isTopic={isTopic} singlePanel={singlePanel} fullPage={fullPage} >
            <TopRow><Row key="r1"><Link href={homeLink} legacyBehavior><a rel="nofollow"><PubImageBox><PubImage loud={session.loud} isTopic={isTopic} placeholder={"blur"} sizes="(max-width: 768px) 100vw,
           (max-width: 2200px) 50vw, 33vw"      src={catIcon} alt={catName} /></PubImageBox></a></Link>
                <Right length={0}><Link href={homeLink} legacyBehavior><a rel="nofollow"><SiteName isTopic={isTopic}>{site_name}</SiteName></a></Link><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right></Row></TopRow>
            {author ? <Row>{author}</Row> : null}
            <Row key="r2"><Link href={itemUrl} legacyBehavior><a rel="nofollow"><Title isTopic={isTopic}>{title}</Title></a></Link></Row>
            <hr />
            <Row key="3.1"><Link href={itemUrl} legacyBehavior><a rel="nofollow">{item.url}</a></Link></Row>
            <hr />

            {(headless == 1 && (bodyHtml || bodyBlocks)) ? null : <Row key="r3"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}>
                <NextImage sizes="(max-width: 768px) 100vw,
           (max-width: 2200px) 50vw, 33vw"  placeholder={"blur"} blurDataURL={blur} style={{ objectFit: "cover" }} data-id={"NextImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>}


            {summary ? <div><Row><br/>Summary by Q.ai:</Row><Row key="r14"><Body><Markdown>{entityToHtml(summary)}</Markdown></Body></Row><hr/></div> : null}
            <Row key="r4"><Body>{bodyBlocks ? bodyBlocks : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml ? bodyHtml :summary?null: description}</ReactMarkdown>}</Body></Row>
            {AckBlock}
            <Share>{session.userslug ? null : <CallToShare>
                <CallImage><img width="48" src={channelDetails.logo} /></CallImage>
                Please help us grow by sharing the links to this thread via email, social networks and forums. {channelName == 'America First News' ? `Facebook and Google are both shadow-banning America First News, we can't survive without your help!` : `Your help is greatly appreciated!`}
            </CallToShare>}<RWebShare
                data={{
                    text: description,
                    url: `/${qparams.forum}/topic/${tag}/${slug}`,
                    title,
                }}
                onClick={() => console.log("shared successfully!")}
            >
                    <Button> Share! </Button>
                </RWebShare>
            </Share>

        </VerticalWrap>
    }
    else if (isReact) {
        let { id, author_avatar, tag, catName, catIcon, author_name, postBody, subscr_status, createdat, thread_author, thread_title, thread_description, thread_url, slug, moderate_flag } = item;
        const { diff, timeString } = TimeDifference(createdat, qparams.timestamp)

        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/${id}/#comment-${id}`} legacyBehavior><a rel="nofollow">
            <VerticalWrap isTopic={isTopic} isRight={isRight}>
                <TopRow><Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
          (max-width: 2200px) 50vw, 33vw"      placeholder={"blur"} src={catIcon} alt={catName} width={28} height={28} /></PubImageBox>
                    {qType == 'mix' ? <Comment>comment</Comment> : null}<Author>{thread_author ? thread_author : catName}</Author></Row></TopRow>
                <Row key="r2"><Title isTopic={isTopic}>{thread_title}</Title></Row>
                <Row key="r3"><Description><Markdown>{entityToHtml(description)}</Markdown></Description></Row>
                <Row key="r4"><AvatarBox><Avatar placeholder={"blur"} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} /></AvatarBox>
                    <AuthorPoster>{author_name}</AuthorPoster>
                    <StarContainer><Star level={subscr_status} size={16} /></StarContainer>
                    <TimeSince isTopic={isTopic}>{timeString}</TimeSince></Row>
                <Row key="r5">
                    <Moderate flag={moderate_flag}><Markdown>{`<div style="width:100%;">${entityToHtml(postBody)}</div>`}</Markdown></Moderate>
                </Row>
            </VerticalWrap></a></Link>
    }
    else {
        let { catIcon, catName, tag, image, site_name, published_time, author, slug }: { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string } = item;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = blur;
        }
        if (site_name) {
            site_name = site_name.split('|')[0];
            site_name = site_name.split(' - ')[0];
        }
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp);
        if (slug == 'loading') {
            return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber != 'l1' ? '/' + qparams.layoutNumber : ''}`} legacyBehavior><a rel="nofollow"><VerticalWrap isTopic={isTopic}>
                <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"     placeholder={"blur"} src={blur} alt={'America First News'} /></PubImageBox>
                    <Right length={'am1.news'.length}><SiteName isTopic={isTopic}>{'am1.news'}</SiteName><TimeSince isTopic={isTopic}>{0}</TimeSince></Right></Row>
                {author ? <Row>{author}</Row> : null}
                <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
                <Row key="r3"><Markdown  >{'The Internet of Us'}</Markdown></Row>
                <Row key="r4" ><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={blur} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>
            </VerticalWrap></a></Link>
        }
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber != 'l1' ? '/' + qparams.layoutNumber : ''}`} legacyBehavior><a rel="nofollow">
            <VerticalWrap isTopic={isTopic} isTag={isTag} diff={diff} isRight={isRight}>
                <TopRow><Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} style={{ height: '38', width: 'auto' }} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"       placeholder={"blur"} src={catIcon} alt={catName} /></PubImageBox>
                    <Right length={site_name.length}><SiteName isTopic={isTopic}>{site_name}</SiteName><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right></Row></TopRow>
                {author ? <Row>{author}</Row> : null}
                <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
                <Row key="r3"><Markdown  >{entityToHtml(description)}</Markdown></Row>
                <Row key="r4"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={blur} style={{ maxWidth: "100%", height: "100%", objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>
            </VerticalWrap></a></Link>
    }
}
export default Qwiket;
