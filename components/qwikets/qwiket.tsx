import React, { useState, useEffect, useCallback, ReactFragment, ReactNode } from "react";
import { useRouter } from 'next/router'
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams'
import NextImage from 'next/image';
import TimeDifference from '../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppContext } from "../../lib/context";
import Link from 'next/link'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Markdown from 'markdown-to-jsx'
import Swipe from "react-easy-swipe"
import YouTube from 'react-youtube'


interface IsTopic {
    isTopic: boolean,
    isTag?: boolean,
    diff?: number,
    singlePanel?: boolean
}
const VerticalWrap = styled.div<IsTopic>`
    border-color:${({ isTag, diff }) => (isTag && diff && (diff < 3600)) ? 'var(--qwiket-border-new) var(--qwiket-border-stale) var(--qwiket-border-new) var(--qwiket-border-new)' : isTag && diff && diff < 4 * 3600 ? 'var(--qwiket-border-recent) var(--qwiket-border-stale) var(--qwiket-border-recent) var(--qwiket-border-recent)' : 'var(--qwiket-border-stale)'};
    border-style: solid ${({ isTopic, singlePanel }) => isTopic ? singlePanel ? 'solid' : 'none' : 'solid'}  ${({ isTopic }) => isTopic ? 'none' : 'solid'}   ${({ isTopic }) => isTopic ? 'none' : 'solid'}  ;
    border-width:${({ isTopic }) => isTopic ? 1 : 1}px;
    cursor:pointer;
    padding-left:${({ isTopic }) => isTopic ? 8 : 8}px;
    padding-right:${({ isTopic }) => isTopic ? 8 : 6}px;
    padding-bottom:6px;
    width:100%;
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
`
const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:4px;
    font-size:1.0rem;
`

const SiteName = styled.div<IsTopic>`
font-size:${({ isTopic }) => isTopic ? 22 : 12}px;   
margin-right:20px;
`

const Author = styled.div`
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
const Title = styled.div<IsTopic>`

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
    margin-top: ${({ isTopic }) => isTopic ? 16 : 6}px;
    padding-top: 0px;
    margin-right: 16px;
    height:${({ isTopic }) => isTopic ? 64 : 28}px;
    width:auto;
    opacity:${({ loud, isTopic }) => (loud || isTopic) ? 1.0 : .8};
    margin-bottom: 4px;
`
const PubImageBox = styled.div`
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 0px;
`

const Avatar = styled.img`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;  
    margin-bottom: 10px;
`
const AvatarBox = styled.div`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 10px;
    width:48px;
    height:48px;
`
const Body = styled.div`
    width:100%; 
   
`
const Right = styled.div`
    padding-top:4px;
    height:auot;
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
const Qwiket = ({ extraWide, item, isTopic, qType, singlePanel, fullPage }: { extraWide: boolean, item: any, isTopic: boolean, qType?: string, singlePanel?: boolean, fullPage?: boolean }) => {

    const isTag = qType == 'tag';
    //console.log("Qwiket render ", singlePanel, isTopic, qType, isTag)
    const router = useRouter();
    const { session, qparams } = useAppContext();
    const isReact = item && typeof item.qpostid !== 'undefined' && item.qpostid;
    let { description, title } = item ? item : { description: '', title: '' };
    //   console.log("Qwiket", {loud:session.loud,extraWide})
    if (isTopic) {
        let { catIcon, catName, tag, image, site_name, published_time, author, body }: { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string, body: any } = item ? item : { catIcon: '', catName: '', tag: '', image: '', site_name: '', published_time: '', author: '', body: '' };
        if (!image)
            image = 'https://qwiket.com/static/css/afnLogo.png';
        if (!catIcon)
            catIcon = 'https://qwiket.com/static/css/afnLogo.png';
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = 'https://qwiket.com/static/css/afnLogo.png';
        }

        if (!title)
            title = 'Loading...';
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp)
        let bodyHtml: string='';
        interface BodyBlock {
            type: string;
            content: string;
            id?: string;
        }
        let bodyBlocks: Array<ReactNode> | null = null;
        if (body) {
            /* const blocks = body.blocks;
             bodyHtml = blocks.reduce((accum: string, b: any) => {
                 console.log("reduce:", b, accum)
                 if (b.blockType == 'html') {
                     return accum += b.html;
                 }
             }, '')
             */
            bodyBlocks = body.map((b: BodyBlock) => {

                return (b.type == "twitter" && b.id) ? <TwitterTweetEmbed tweetId={b.id} placeholder="Loading a Tweet..." /*options={{theme:session.dark?'dark':'light'}}*/ /> : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{b.content}</ReactMarkdown>
            })

        }
        //bodyHtml=bodyHtml?.replaceAll('twittertweetembed','TwitterTweetEmbed');
        // bodyHtml=bodyHtml?.replaceAll('youtubeembed','YoutubeEmbed');
        //if(bodyHtml)
        //bodyHtml=`<div>${bodyHtml}</div>`
        //  bodyHtml=bodyHtml?.replaceAll('iframe','Iframe');

        // console.log("checking for code tag",bodyHtml?.indexOf('<code>'));

        //console.log("BODY:", body)
        //console.log(JSON.stringify({ isTopic, singlePanel }))

        const swipe = (position: any, event: any, type: string) => {
            console.log("swipe", position, event, type);
            if (position.x > 5 && position.y < 10 && position.y > -10) {
                console.log("RIGHT SWIPE")
                router.push(item.url);
                //rotate(type, 1)
            }
            if (position.x < -5 && position.y < 10 && position.y > -10) {
                console.log("LEFT SWIPE")
                router.back();
            }
        }
        return <Swipe onSwipeMove={(position, event) => swipe(position, event, qparams.type)}><VerticalWrap isTopic={isTopic} singlePanel={singlePanel} >
            <Row key="r1"><PubImageBox><PubImage loud={session.loud} isTopic={isTopic} placeholder={"blur"} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"      src={catIcon} alt={catName} /></PubImageBox>
                <Right><SiteName isTopic={isTopic}>{site_name}</SiteName><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right></Row>
            {author ? <Row>{author}</Row> : null}
            <Row key="r2"><Link href={item.url}><Title isTopic={isTopic}>{title}</Title></Link></Row>
            <Row key="3.1"><Link href={item.url}>{item.url}</Link></Row>
            <Row key="r3"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"  placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>
          
            <Row key="r4"><Body>{bodyBlocks ? bodyBlocks : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml ? bodyHtml : description}</ReactMarkdown>}</Body></Row>

        </VerticalWrap></Swipe>


    }
    else if (isReact) {
        let { id, author_avatar, tag, catName, catIcon, author_name, postBody, subscr_status, createdat, thread_author, thread_title, thread_description, thread_url, slug } = item;
        // console.log("React ",item)
        if (id)
            console.log("disqus id:", id)
        const { diff, timeString } = TimeDifference(createdat, qparams.timestamp)
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/${id}/#comment-${id}`}><VerticalWrap isTopic={isTopic}>
            <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"      placeholder={"blur"} src={catIcon} alt={catName} width={28} height={28} /></PubImageBox>
                {qType == 'mix' ? <Comment>comment</Comment> : null}<Author>{thread_author ? thread_author : catName}</Author></Row>
            <Row key="r2"><Title isTopic={isTopic}>{thread_title}</Title></Row>
            <Row key="r3"><Description><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Description></Row>
            <Row key="r4"><AvatarBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} fill={true} /></AvatarBox><AuthorPoster>{author_name}</AuthorPoster>
                <TimeSince isTopic={isTopic}>{timeString}</TimeSince></Row>
            <Row key="r5"><ReactMarkdown rehypePlugins={[rehypeRaw]} >{postBody}</ReactMarkdown></Row>

        </VerticalWrap></Link>
    }
    else {
        let { catIcon, catName, tag, image, site_name, published_time, author, slug }: { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string } = item;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = 'https://qwiket.com/static/css/afnLogo.png';
        }
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp);
        //  console.log("Render Qwuket", item.catIcon,item.image,item.title)
        if (!item.catIcon) {
            console.log("********************************************************************************************************")
        }
       // console.log("qwiket render 2 istag", isTag, 'diff:', diff)
        if (slug == 'loading') {
            return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber!='l1'?'/'+qparams.layoutNumber:''}`}><VerticalWrap isTopic={isTopic}>
                <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"     placeholder={"blur"} src={'https://qwiket.com/static/css/afnLogo.png'} alt={'America First News'} /></PubImageBox>
                    <Right><SiteName isTopic={isTopic}>©{'am1.news'}</SiteName><TimeSince isTopic={isTopic}>{0}</TimeSince></Right></Row>
                {author ? <Row>{author}</Row> : null}
                <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
                <Row key="r3"><ReactMarkdown rehypePlugins={[rehypeRaw]} >{'The Internet of Us'}</ReactMarkdown></Row>
                <Row key="r4" ><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            </VerticalWrap></Link>
        }
        console.log ("qwiketLink",`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber!='l1'?'/'+qparams.layoutNumber:''}`);
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber!='l1'?'/'+qparams.layoutNumber:''}`}><VerticalWrap isTopic={isTopic} isTag={isTag} diff={diff}>
            <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} style={{ height: '38', width: 'auto' }} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"       placeholder={"blur"} src={catIcon} alt={catName} /></PubImageBox>
                <Right><SiteName isTopic={isTopic}>©{site_name}</SiteName><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right> </Row>
            {author ? <Row>{author}</Row> : null}
            <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
            <Row key="r3"><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Row>
            <Row key="r4"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ maxWidth: "100%", height: "100%", objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

        </VerticalWrap></Link>
    }


}
export default Qwiket;