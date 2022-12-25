import Head from 'next/head'
import React,{useState} from "react";
import useSWR from 'swr'
import styled from 'styled-components';

import axios from 'axios'

const fetcher = (url: string)  => axios.get(url).then(res => res.data)
 /**
   * SSR will set the width according to the type of device, ISR will set the maximum width (3500) from the responsive perspective
   * custom - is set to true for SSR, false for static (i.e. - no custom user properties)
   */
interface CommonProps{
  width:number,
  custom:boolean 
}
const isBrowser = () => typeof window !== `undefined`
export default function Home(props:CommonProps) {
  const [width,setWidth]= useState(isBrowser()?window.innerWidth:props.width); 
 
    return (
      <>
       <Head>
                <title>Lake</title>
                <meta name="description" content="Online community newspaper" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                Common Page
            </main>
    
     </>
    )}