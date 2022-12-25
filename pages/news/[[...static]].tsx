import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import Common,{CommonProps} from "../../components/common"

const inter = Inter({ subsets: ['latin'] })
export default function Home({channel,forum,type,tag,newsline,threadid,layoutNumber}:CommonProps) {
   
    return <Common session={{width:3500}} custom={true} channel={channel} forum={forum} newsline={newsline} type={type} tag={tag} threadid={threadid} layoutNumber={layoutNumber} />
}
interface StaticParams{
    params:{static:string[]}
}
export async function getStaticProps(props:StaticParams ) {
    const {params}=props;
    console.log("getStaticProps",params)
    let ssr=props.params?.static as string[];
    if(!ssr)
        ssr=["qwiket","usconservative","newsline","main"];
    const [channel,forum,type]=ssr;
    const tag=(type=='topic'||type=='home')?ssr[3]:"";
    const silo=(type=='topic'||type=='home')?ssr[4]:"";
    const threadid=(type=='topic'||type=='home')?ssr[5]:"";
    let layoutNumber=+((type=='topic'||type=='home')?ssr[6]:ssr[4]);
    const newsline=(type=='newsline'||type=='solo')?ssr[3]:"";

    return {
         props: {
            channel,
            forum,
            type,
            tag,
            silo,
            newsline,
            threadid,
            layoutNumber

        }, // will be passed to the page component as props
        revalidate:10
    }
}
export async function getStaticPaths() {
    return {
      paths: [{ params: { static: ["qwiket","usconservative","newsline","main"]}}],
      fallback: "blocking", // can also be true or 'blocking'
    }
  }
//https://ng.d4rum.com/news/topic/blah
