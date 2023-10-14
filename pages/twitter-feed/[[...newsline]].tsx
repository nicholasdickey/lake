
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
import {
    fetchQueue, fetchChannelConfig, FetchQueueKey,
} from '../../lib/lake-api';
import encodeEntities from '../../lib/encode-entities';
export default function Home({ items, channelDetails, host, forum }: { channelDetails: any, items: any[], host: string, forum: string }) {
    const header = `<?xml version="1.0" encoding="UTF-8" ?>  
    <rss version="2.0"> 
      <channel> 
        <title>NEWS DIGEST: ${channelDetails.title}</title> 
        <link>https://${host}</link> 
        <description>${channelDetails.description}</description>
      `;
    const rssItems = items.map((p, itemCount) => {
        try {
            //  console.log("rss item:", JSON.stringify(p))
            const title = `${p.site_name ? p.site_name + ': ' : ''}${p.title}` || ``;
            const date = p.shared_time;
            if (!date || date == "null") return;
            // console.log("RSS date ",date);

            const cdate = Math.round(
                new Date().getTime() / 1000
            );

            if (date > cdate - 600)
                // delay by 10 minutes
                return;
            if (itemCount++ > 10) return;
            const isoDate = new Date(
                date * 1000
            ).toISOString();
            const flink = `https://${host}/${forum}/topic/${p.tag}/${p.slug}`;

            let description = p.description;
            const descrParts = description.split("{ai:summary}");
            description - descrParts[0];
            let summary = descrParts.length > 1 ? descrParts[1] : '';
            console.log("summary:", summary)
            summary = summary.replaceAll('<p>', '').replaceAll('</p>', '\n');
            if (summary.trim() == '[object Object]')
                summary = null;


            description = summary ? summary : description;
            console.log('rss description', description)
            return `<item>
            <link>${flink}</link>
            <title>${title}</title>
            <description>${description}</description
            <pubDate>${isoDate}</pubDate>  
        </item>`
        }
        catch (x) {
            console.log("Exception in rssItems", x)
        }
    })
    const all = `${header}${rssItems.join('\n')} </channel>
    </rss>`
    // console.log("RSS",all)
    return <div><div>{all}</div></div>;
}



export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    try {
        let newsline = context.params?.newsline || process.env.DEFAULT_NEWSLINE;
        if (!newsline)
            process.env.DEFAULT_NEWSLINE
        console.log("FEED:", { newsline, context: context.params })
        newsline = `rss-${newsline || process.env.DEFAULT_NEWSLINE}`;

        const forum = process.env.DEFAULT_FORUM || '';
        const type = 'newsline';
        let host = context.req.headers.host || "";
        if (host == 'cloud.digitalocean.com')
            host = 'american-outdoorsman.news';
        const channelConfig = await fetchChannelConfig(process.env.DEFAULT_NEWSLINE || '');
        console.log("ChannelConfig", host)
        const { displayName, description } = channelConfig.channelDetails
        const channelDetails = {
            title: displayName,
            description,

        }

        const key: FetchQueueKey["key"] = ['queue', type, newsline, 0, forum, '', 0, '0', '', '', 0, '', '', 12];
        console.log("rss key==", key)
        const { items } = await fetchQueue(key);
        if (context.res) {
            const header = `<?xml version="1.0" encoding="UTF-8" ?>  
    <rss version="2.0"> 
      <channel> 
        <title>${channelDetails.title} Digest</title> 
        <link>https://${host}</link> 
        <description>${channelDetails.description}</description>
      `;

            const rssItems = items.map((p: any, itemCount: number) => {
                try {
                    //  console.log("rss item:", JSON.stringify(p))
                    const isDigest=p.title.indexOf('Digest')>=0;
                    const title = !isDigest?`${p.site_name ? p.site_name + ' Digest: ' : ''}${p.title}`:p.title || ``;
                    const date = p.shared_time;
                    const image=p.image;
                    const url=p.url;
                    const threadid=p.slug;
                    const tag=p.tag;
                    if (!date || date == "null") return;
                    // console.log("RSS date ",date);

                    const cdate = Math.round(
                        new Date().getTime() / 1000
                    );

                    /* if (date > cdate - 600)
                         // delay by 10 minutes
                         return;*/
                    if (itemCount++ > 10) return;
                    const isoDate = new Date(
                        date * 1000
                    ).toISOString();
                    const flink = isDigest?`https://${host}/${forum}/topic/${p.tag}/${p.slug}`:`${url}`;
                    const oglink=`https://${host}/api/og.png?threadid=${p.slug}&tag=${p.tag}`
                    let description = p.description;

                    const descrParts = description.split("{ai:summary}");
                    description - descrParts[0];
                    let summary = descrParts.length > 1 ? descrParts[1] : '';
                    summary = summary.replaceAll('<p>', '<p>').replaceAll('</p>', '</p>\n\n');
                    //description=description.replaceAll('"', '&#34;').replaceAll("'", '&#39;').replaceAll("&", '&#38;');
                    //summary=summary.replaceAll('"', '&#34;').replaceAll("'", '&#39;').replaceAll("&", '&#38;');
                    summary = encodeEntities(summary);
                    summary = `${summary}- Digest © am1.news https://www.am1.news <p> Please "like" and retweet to help us grow. And leave comments!</p>`;
                    description = encodeEntities(description);
                    console.log("description:", description)
                    console.log("summary:", summary);
                    if (summary.trim() == '[object Object]')
                        summary = null;
                    description = !isDigest&&summary ? summary : description;
                    console.log('rss description', description)
                    console.log('image', image );
                    console.log('url:', url,threadid,tag );
                    description+=`
                        <a href="${url}">${title}</a>
                    `    

                    
                    return `
        <item>
            <link>${flink}</link>
            <title>${title}</title>
            <pubDate>${isoDate}</pubDate>  
            <description>${description}</description>
           
        </item>
        `
                }
                catch (x) {
                    console.log("Exception in rssItems", x)
                    context.res.statusCode = 503;
                    return {
                        props: { error: 503 }
                    }

                }
            })
            const rss = rssItems.filter((p: any) => p ? true : false)
            const all = `${header}${rss.join('\n')} </channel>
    </rss>`
            context.res.setHeader('Content-Type', 'text/xml');
            context.res.write(all);
            context.res.end();
        }
        return { props: { items, channelDetails, host, forum } }
    }
    catch (x) {
        console.log("Exception in rss", x)
        context.res.statusCode = 503;
        return {
            props: { error: 503 }
        }

    }
}
