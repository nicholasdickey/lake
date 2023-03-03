import React, { useState } from 'react'
import styled from 'styled-components';
import { DiscussionEmbed } from 'disqus-react';
import { useAppContext } from '../../../lib/context'

interface DisqusParams{
  fullPage:boolean
}
const Disqus = styled.div<DisqusParams>`
    visibility:visible;
    position:relative;
    z-index:50;
    color:var(--text);
    background-color: var(--background);
    margin:${({fullPage})=>fullPage?4:16}px;
    #disqus_thread a{
          color:var(--text);        				
    }
    #disqus_thread div{
        font-family:roboto;
    }   
    #disqus_thread{
      color:var(--text);
    }
    #disqus_thread .btn{
      color:var(--text) !important;
    }
    #disqus_thread .post-message{
       color:var(--text) !important;
    }
   
   
`
const CommentsButton=styled.div`
  width:auto;
  padding:4px;
  border:solid grey 1px;
  background-color: var(--notificationButton);
  color:#eee;

`
const CommentsButtonWrap=styled.div`
  width:100%;
  display:flex;
  justify-content: space-around;

`
const Local = ({ forum,  cc, slug, title,fullPage }: { forum: string,   cc: string, slug: string, title: string,fullPage?:boolean }) => {
    const { session, qparams } = useAppContext();
    const [draw,setDraw]=useState(cc&&cc.length>1?true:false)

    
   if(!fullPage)
   fullPage=false;
    if(!title)
        title='';

    var t = title?.replace(/"/g, '\'');
    t = t.replace(':', '-');
    cc = cc ? '#comment-' + cc : '';
    let url = `http://am1.news/${qparams.forum}/topic/${qparams.tag}/${slug}`;//"https://qwiket.com" + contextUrl + "/topic/" + realDisqThreadid + cc;
   // console.log("Disqus",{title,t,url,slug}) 
    return <>{true?
        <Disqus fullPage={fullPage}>
          <DiscussionEmbed
            shortname={forum}
            // @ts-ignore
            theme={session.dark}   // this is to force redraw, there is no theme property
            config={{
                identifier: slug,
                title: t,
                url
            }} />
            </Disqus>
            :<CommentsButtonWrap><CommentsButton onClick={()=>setDraw(true)}><a>Show Comments</a></CommentsButton></CommentsButtonWrap>
            
          }</>



}
export default Local;
   /* * * CONFIGURATION VARIABLES * * */
/*   var disqus_shortname ;
   var disqus_identifier;
   var disqus_url;
   var disqus_title;
 var disqus_config = function () {
          this.language = 'EN'
        };*/

/* * * DON'T EDIT BELOW THIS LINE * * */


/*  (function() {
    if(__CLIENT__){
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        }
      })(); */

