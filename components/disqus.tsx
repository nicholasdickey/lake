import React, { useState } from 'react'
import styled from 'styled-components';
import { DiscussionEmbed } from 'disqus-react';
import { useAppContext } from '../lib/context'

const Disqus = styled.div`
    color:var(--text);
    background-color: var(--background);
    margin:6px;
    #disqus_thread a{
          color:var(--text);        
				
    }
    #disqus_thread div{
        font-family:roboto;
    }   
`

const Local = ({ contextUrl, forum, realDisqThreadid, cc, slug, title }: {  contextUrl: string, forum: string, realDisqThreadid: string,  cc: string, slug: string, title: string }) => {
    const { session, qparams } = useAppContext();
    if(!title)
        title='';
    console.log('LOCAL RENDER %s', title)
    //if (title) {
    var t = title.replace(/"/g, '\'');
    t = t.replace(':', '-');
    //t=channel?('['+channel+'] '+t):t
    cc = cc ? '#' + cc : '';
    let url = "https://qwiket.com" + contextUrl + "/topic/" + realDisqThreadid + cc;
    // console.log('title=%s',t)
    //console.log('channel=%s',channel)
    //console.log('Local identifier=%s',this.props.threadid)  
    //console.log('Local url=%s',url)
    //
    //let identifier = threadid
    // console.log('LOCAL render: site:%s,channel:%s,contextUrl:%s,title:%s,url:%s,identifier:%s',site,channel,contextUrl,t,url,identifier)
    /* if(site!=window.lastDisqusForum){
       window.lastDisqusForum=site;
       this.redraw=true;
       console.log("RESETTING DISQUS")
       //this.setState({redraw:true})
       return   <div id="local">
               <ReactDisqusThread
                   shortname={null}
                   identifier={null}
                   title={null}
                   url={null}                
                   onNewComment={null}/>
 )                   </div> 
     }*/
    /*if(threadid!=topic.get("threadid")){
 
      console.log("NOT MACHING - INVALIDATE")
        return <span/>
      }*/
    //  console.log("local: identifier:%s",identifier,url)
    // console.log('Disqus url=%s','/disqus/'+site+'/'+encodeURIComponent(identifier)+'/'+encodeURIComponent(title)+'/'+encodeURIComponent(url));
console.log("Disqus:",{forum,slug,t,url})
    return (
        <Disqus><DiscussionEmbed
            shortname={forum}
            config={{
                identifier: slug,
                title: t,
                url
            }} /></Disqus>
    )



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

