import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams'
import NextImage from 'next/image';
import TimeDifference from '../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppContext } from "../../lib/context";
import Link from 'next/link'
import {TwitterTweetEmbed} from 'react-twitter-embed';
import Markdown from 'markdown-to-jsx'


interface IsTopic {
    isTopic: boolean
}
const VerticalWrap = styled.div<IsTopic>`
    border-color: grey;
    border-style: solid;
    border-width:${({ isTopic }) => isTopic ? 0 : 1}px;
    cursor:pointer;
    padding-left:${({ isTopic }) => isTopic ? 16 : 6}px;
    padding-right:${({ isTopic }) => isTopic ? 16 : 6}px;
    padding-bottom:6px;
    width:100%;
    margin-bottom:6px;
    h1 {
        font-size:18px;
        font-weight:400;
    }
    blockquote {
        border-left:1px;
    }
`
const Row = styled.div`
    display:flex;
    //padding-left:2px;
   // padding-right:2px;
    align-items: center;
    justify-content: space-between;
    //flex-wrap: wrap;
   // width: 100%;
    //padding: 0px;
   // position:relative;
`

const SiteName = styled.div<IsTopic>`
font-size:${({ isTopic }) => isTopic ? 18 : 12}px;   
margin-right:20px;
`

const Author = styled.div`
font-size: 12px;   
`
const AuthorPoster = styled.div`
font-size: 14px;   
`
const TimeSince = styled.div`
font-size:10px;
    
`
const Title = styled.div`
    
    //font-weight:500;
    line-height: 1.2;
    font-size: 1.2rem; 
   
    text-align: left; 
    margin-top:10px;
    margin-bottom:10px;
   
`
const Description = styled.div`
    
    //font-weight:500;
   
    margin-bottom:16px;
   
`
const Image = styled.img`
   
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    margin-left: auto;
    margin-right: auto;               
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
    margin-left: auto;
    margin-right: auto;
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
    //max-width: 48px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
    height:${({ isTopic }) => isTopic ? 64 : 28}px;
    width:auto;
    opacity:${({ loud, isTopic }) => (loud || isTopic) ? 1.0 : .8};
    margin-bottom: 10px;
`
const PubImageBox = styled.div`
    position: relative;
   // object-fit: cover;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
    height:auto;
    width: 38px;;
    //height:28px;
   // min-width:28px; 
     //width:100%; 
    //width:48px !important; 
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
    display:flex;
    justify-content:space-between;

`
const TwitterEmbed=({tweetid}:{tweetid:string})=>{
    console.log("TwitterEmbed",tweetid);
    return <TwitterTweetEmbed tweetId={tweetid}/>

}
const Qwiket = ({ extraWide, item, isTopic }: { extraWide: boolean, item: any, isTopic: boolean }) => {

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
        if (catName.indexOf('Liberty Daily') >= 0) {
            catIcon = 'https://qwiket.com/static/css/afnLogo.png';
        }

        if (!title)
            title = 'Loading...';
        const diff = TimeDifference(published_time, qparams.timestamp)
        let bodyHtml;
        if (body) {
            const blocks = body.blocks;
            bodyHtml = blocks.reduce((accum: string, b: any) => {
                console.log("reduce:", b, accum)
                if (b.blockType == 'html') {
                    return accum += b.html;
                }
            }, '')
        }
        bodyHtml=bodyHtml.replaceAll('twittertweetembed','TwitterTweetEmbed');
        // console.log("checking for code tag",bodyHtml?.indexOf('<code>'));

        // console.log("BODY:",bodyHtml)
        return <VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><PubImage loud={session.loud} isTopic={isTopic} placeholder={"blur"} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"      src={catIcon} alt={catName} /></PubImageBox>
                <Right><SiteName isTopic={isTopic}>{site_name}</SiteName><TimeSince>{diff}</TimeSince></Right></Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"  placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            <Row><Body>{true?<Markdown  options={{
                        forceBlock: true,
                        overrides: {
                            TwitterTweetEmbed:TwitterEmbed
                            
                           /* img: {
                                component: ImageRenderer,
                                props: {
                                    setState,
                                    index: `lightbox-${index}`,
                                    state,
                                },
                            },
                            a: {
                                component: LinkRenderer,
                                index: `link-${index}`,
                                theme,
                            },*/
                        },
                    }}>{bodyHtml ? bodyHtml : description}</Markdown>:<ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml ? bodyHtml : description}</ReactMarkdown>}</Body></Row>

        </VerticalWrap>
        

    }
    else if (isReact) {
        let { author_avatar, tag, catName, catIcon, author_name, postBody, subscr_status, createdat, thread_author, thread_title, thread_description, thread_url, slug } = item;
        // console.log("React ",item)

        const diff = TimeDifference(createdat, qparams.timestamp)
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/na`}><VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"      placeholder={"blur"} src={catIcon} alt={catName} width={28} height={28} /></PubImageBox><Author>{thread_author ? thread_author + ", " + catName : catName}</Author></Row>
            <Row><Title>{thread_title}</Title></Row>
            <Row><Description><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Description></Row>
            <Row><AvatarBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} fill={true} /></AvatarBox><AuthorPoster>{author_name}</AuthorPoster><TimeSince>{diff}</TimeSince></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{postBody}</ReactMarkdown></Row>

        </VerticalWrap></Link>
    }
    else {
        let { catIcon, catName, tag, image, site_name, published_time, author, slug }: { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string } = item;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = 'https://qwiket.com/static/css/afnLogo.png';
        }
        const diff = TimeDifference(published_time, qparams.timestamp);
        //  console.log("Render Qwuket", item.catIcon,item.image,item.title)
        if (!item.catIcon) {
            console.log("********************************************************************************************************")
        }
        if (slug == 'loading') {
            return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/na`}><VerticalWrap isTopic={isTopic}>
                <Row><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"     placeholder={"blur"} src={'https://qwiket.com/static/css/afnLogo.png'} alt={'America First News'} /></PubImageBox>
                    <Right><SiteName isTopic={isTopic}>©{'am1.news'}</SiteName><TimeSince>{0}</TimeSince></Right></Row>
                {author ? <Row>{author}</Row> : null}
                <Row><Title>{title}</Title></Row>
                <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{'The Internet of Us'}</ReactMarkdown></Row>
                <Row><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            </VerticalWrap></Link>
        }
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/na`}><VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} style={{ height: '38', width: 'auto' }} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"       placeholder={"blur"} src={catIcon} alt={catName} /></PubImageBox>
                <Right><SiteName isTopic={isTopic}>©{site_name}</SiteName><TimeSince>{diff}</TimeSince></Right> </Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Row>
            <Row><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ maxWidth: "100%", height: "100%", objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

        </VerticalWrap></Link>
    }


}
export default Qwiket;