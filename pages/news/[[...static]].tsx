import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import Common from "../../components/common"

const inter = Inter({ subsets: ['latin'] })
interface StaticProps {
    text:string
}
export default function Home(props:StaticProps) {
    console.log("RENDER",props)
    return <Common/>
}
interface StaticParams{
    params:{static:string[]}
}
export async function getStaticProps(props:StaticParams ) {
    const {params}=props;
    console.log("getStaticProps",params)
    return {
        props: { text: `Hello ${params.static[1]}` }, // will be passed to the page component as props
        revalidate:10
    }
}
export async function getStaticPaths() {
    return {
      paths: [{ params: { static: ["topic","blah"]}}],
      fallback: "blocking", // can also be true or 'blocking'
    }
  }
//https://ng.d4rum.com/news/topic/blah
