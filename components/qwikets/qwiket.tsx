import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
//import { Image } from "react-bootstrap";
import TimeDifference from '../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
const VerticalWrap = styled.div`
border-color: grey;
border-style: solid;
border-width:1px;
cursor:pointer;
padding-left:6px;
padding-right:6px;
margin-bottom:6px;
`
const Row = styled.div`
    display:flex;
    padding-left:6px;
    padding-right:16px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0px;
`
const SiteName = styled.div`
font-size: 12px;   
`


const Author = styled.div`
font-size: 16px;   
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
const PubImage = styled.img`
    position: relative;
    max-height: 28px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
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
const Qwiket = ({ session, qparams, item, isTopic }: { session: Options, qparams: Qparams, item: any, isTopic: boolean }) => {
    const isReact = typeof item.qpostid !== 'undefined';
    let { description, title } = item;


    if (isReact) {
        let { author_avatar,category, cat_name, cat_icon, author_name, id, body, published_time, subscr_status, status, createdat, thread_author, thread_title, thread_description, thread_url, threadid } = item;

        const diff = TimeDifference( createdat,qparams.timestamp)
        return <VerticalWrap>
            <Row><PubImage src={cat_icon} alt={cat_name} /><Author>{thread_author}</Author></Row>
            <Row><Title>{thread_title}</Title></Row>
            <Row><Description>{description}</Description></Row>
            <Row><Avatar src={author_avatar} alt={author_name} /><Author>{author_name}</Author><TimeSince>{diff}</TimeSince></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{body}</ReactMarkdown></Row>

        </VerticalWrap>
    }
    else {
        let { catIcon, catName, cat, image, site_name, published_time, author } = item;
        const diff = TimeDifference( published_time,qparams.timestamp)
        return <VerticalWrap>
            <Row><PubImage src={catIcon} alt={catName} /><SiteName>©{site_name}</SiteName><TimeSince>{diff}</TimeSince></Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Row>
            <Row><Image src={image} alt={title} /></Row>
            
        </VerticalWrap>
    }


}
export default Qwiket;