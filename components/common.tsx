import Head from 'next/head'
import React,{useState} from "react";
import styled from 'styled-components';

interface CommonProps{
  width:number,
  custom:boolean
}
const isBrowser = () => typeof window !== `undefined`
export default function Home(props:CommonProps) {
  const [width,setWidth]= useState(isBrowser()?window.innerWidth:props.width); 
  /**
   * SSR will set the width according to the type of device, ISR will set the maximum width (3500) from the responsive perspective
   */
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