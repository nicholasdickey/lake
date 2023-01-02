
import axios from 'axios'
import { createImportSpecifier } from 'typescript';
import { QueueType } from '../components/qwikets/queue'
import { Qparams } from './qparams'

const API_KEY = process.env.API_KEY;

const lakeApi = (url: string) => {
   url = `${process.env.NEXT_PUBLIC_LAKEAPI}${url}`
   //console.log("calling lakeApi, ",url)
   return axios.get(url).then(res => res.data)
}
export const fetchChannelConfig = async (slug: string) => {
   try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/channel/fetch?slug=${slug}`
      console.log("calling lakeApi fetchChannelConfig ", url)
      const res = await axios.get(url);
      return res.data
   }
   catch (x) {
      console.log("fetchChannelConfig EXCEPTION", x)
   }
   return null
}
export const fetchChannelLayout = async ([u, slug, hasLayout, sessionid, userslug, type, dense, thick, layoutNumber]: [u: string, slug: string, hasLayout: boolean, sessionid: string, userslug: string, type: string, dense: number, thick: number, layoutNumber: string]) => {
   try {
      const sessionParam = hasLayout ? userslug ? `&userslug=${userslug}` : `&sessionid=${sessionid}` : ``
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/layout/fetch?channel=${slug}${sessionParam}&pageType=${type}&dense=${dense}&thick=${thick}&layoutNumber=${layoutNumber}&API_KEY=${API_KEY}`
      console.log("calling lakeApi fetchChannelLayout, ", url)
      const res = await axios.get(url);
      return res.data;
   }
   catch (x) {
      console.log("fetchChannelLayout EXCEPTION", x);
   }
}

export default lakeApi;

export const fetchUser = async ([u, userslug]: [u: string, userslug: string]) => {
   try {
      // console.log("fetchUser client",u,userslug)
      if (!userslug)
         return null
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetch?userslug=${userslug}`
      // console.log("calling lakeApi, ",url)
      const res = await axios.get(url);
      return res.data;
   }
   catch (x) {
      console.log("EXCEPTION in fetchUser", x)
   }
   return null;
}
export const fetchQueue = async ([u, qType, newsline, forum, tag, page, lastid, sessionid, userslug, tail, test]: [u: string, qType: string, newsline: string, forum: string, tag: string, page: number, lastid: string, sessionid: string, userslug: string, tail: string, test: string]) => {
   let params;
   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)

   const addParams = (params: string) => {
      //  console.log("addParams1",params)
      if (userslug)
         params += `&userslug=${userslug}`;
      else if (sessionid)
         params += `&sessionid=${sessionid}`;
      if (u == 'notif')
         params += '&countonly=1';
      if (tail)
         params += `&tail=${tail}`;
      if (test)
         params += '&test=1';   //silo 4 
      //  console.log("addParams",params)   
      return params;
   }
   //  console.log("addParams2",qType==QueueType.mix)
   switch (qType) {
      case 'newsline':
         params = `newsline=${newsline}&type=newsline&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
      case 'reacts':
         params = `forum=${forum}&type=reacts&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
      case 'mix':
         params = `newsline=${newsline}&forum=${forum}&type=mix&page=${page}&lastid=${lastid}`;
         console.log("calling addParams")
         params = addParams(params);
         break;
      case 'hot':
         params = `newsline=${newsline}&type=hot&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
      case 'tag':
         params = `tag=${tag}&type=tag&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
      case 'topics':
         params = `forum=${forum}&type=topics&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
   }
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/queue/fetch?${params}`
   console.log("calling lakeApi fetchQueue, ", url)
   let res;
   try {
      res = await axios.get(url)
   }
   catch (x) {
      console.log("fetchQueue HANDLED EXCEPTION:", x)
      res = await axios.get(url)
      console.log("retried successfully")
   }
   return res ? res.data : null;
}