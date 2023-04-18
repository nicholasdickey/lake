//./lib/lake-api.ts
import axios from 'axios'
import { Options } from './with-session';

/**
 * All calls to lake api
 */

/**
 * Client-side only function
 * 
 * @param slug 
 * @param tag 
 * @returns 
 */
export const unpublish = async (slug: string, tag: string) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/topic/unpublish?slug=${slug}&tag=${tag}`;
   const res = await axios.get(url);
   return res.data;
}
//--------------------------------------------------



/**
 * Client-side only function
 * 
 * @param param0 
 * @returns 
 */
export const accept = async ({ sessionid, userslug, tag }: { sessionid: string, userslug: string, tag: string }) => {
   if (!userslug)
      userslug = '';

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/accept?sessionid=${encodeURIComponent(sessionid)}&userslug=${userslug}&tag=${tag}`;
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
//--------------------------------------------------



/**
 * SWR - getOnlineCount
 */
export interface OnlineCountKey {
   sessionid: string,
   userslug: string
}
export const getOnlineCount = async (key: OnlineCountKey) => {
   const { sessionid, userslug } = key;
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/onlineCount?sessionid=${encodeURIComponent(sessionid)}&userslug=${encodeURIComponent(userslug)}`;
   const res = await axios.get(url);
   return res.data.success?res.data.count:undefined;
}
//--------------------------------------------------



/**
 * Server-only sitemap calls
 */
export const fetchAllSitemaps = async (newsline: string, forum: string,domain:string,format?:string) => {
   if(!format)
   format='txt';
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/sitemap/fetchAll?newsline=${newsline}&forum=${forum}&domain=${domain}&format=${format}`;
   const res = await axios.get(url);
   return res.data.sitemaps;
}
export const fetchSitemap = async (newsline: string, startDate: string,format:string,domain:string,forum:string) => {
   if(!format)
   format="txt";
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/sitemap/fetch?newsline=${newsline}&startDate=${startDate}&format=${format}&domain=${domain}&forum=${forum}`;
   const res = await axios.get(url);
   return res.data.sitemap;
}
//--------------------------------------------------



/**
 * User Session
 */
export const updateUserSession = async (userslug: string, options: Options) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/updateSession?`
   const res = await axios.post(url, {
      userslug,
      options
   });
   return res.data.userSession;
}
export const getUserSession = async (userslug: string) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetchSession?`
   const res = await axios.post(url, {
      userslug
   });
   return res.data.userSession;
}

export const initLoginSession = async (userslug: string, options: Options) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/initLogin?`
   const res = await axios.post(url, {
      userslug,
      options
   });
   return JSON.parse(res.data.userSession) || null;
}
//--------------------------------------------------


/**
 *  Second step of two-step OAuth login
 */
export const processLoginCode = async (code: string, host: string) => {
   const url = `${process.env.NEXT_PUBLIC_QWIKET_API}/api?task=disqus-login&code=${code}&host=${host}`;
   const res = await axios.get(url);
   return res.data.success?res.data.user:false;
}
//--------------------------------------------------


/**
 * Channel config and layout
 * 
 */

export const fetchChannelConfig = async (slug: string) => {
   try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/channel/fetch?slug=${slug}`
      const res = await axios.get(url);
      return res.data;
   }
   catch (x) {
      console.log("fetchChannelConfig EXCEPTION", x)
   }
   return null
}

//SWR
export type fetchChannelLayoutKey = [u: string, slug: string, hasLayout: boolean, sessionid: string, userslug: string, type: string, dense: number, thick: number, layoutNumber: string];
export const fetchChannelLayout = async ([u, slug, hasLayout, sessionid, userslug, type, dense, thick, layoutNumber]: fetchChannelLayoutKey) => {
   try {
      const sessionParam = hasLayout ? userslug ? `&userslug=${userslug}` : `&sessionid=${sessionid}` : ``
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/layout/fetch?channel=${slug}${sessionParam}&pageType=${type}&dense=${dense}&thick=${thick}&layoutNumber=${layoutNumber}`
      // console.log("calling lakeApi fetchChannelLayout, ", url)
      const res = await axios.get(url);
      //  console.log("return ",res.data)
      return res.data;
   }
   catch (x) {
      console.log("fetchChannelLayout EXCEPTION", x);
   }
}
//--------------------------------------------------

/**
 * SWR - fetchUser
 * 
 */

export const fetchUser = async ([u, userslug]: [u: string, userslug: string]) => {
   if (!userslug)
         return null;
   try {     
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetch?userslug=${userslug}`
      const res = await axios.get(url);
      return res.data.user;
   }
   catch (x) {
      console.log("EXCEPTION in fetchUser", x)
   }
   return null;
}
//--------------------------------------------------

/**
 * SWR - fetchTopic
 * 
 */
export type FetchTopicKey = { threadid: string, withBody: number, userslug?: string, sessionid: string, tag: string, ackOverride?: boolean };
export const fetchTopic = async ({ threadid, withBody, userslug, sessionid, tag, ackOverride }: FetchTopicKey) => {
   if (!userslug)
      userslug = '';
   if (!sessionid)
      sessionid = ''
   if (!ackOverride)
      ackOverride = false;

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/topic/fetch?slug=${encodeURIComponent(threadid)}&withBody=${withBody}&userslug=${userslug}&sessionid=${sessionid}&tag=${tag}${ackOverride ? '&ack=1' : ''}`;
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
//--------------------------------------------------

/**
 * SWR - fetchQueue
 * 
 */
export interface FetchQueueKey {
   key: [u: string, qType: string, newsline: string, solo: number, forum?: string, tag?: string, page?: number, lastid?: string, sessionid?: string, userslug?: string, tail?: number, test?: string, breakCache?: string, size?: number, card?: string,isleft?:boolean]
}
export const fetchQueue = async ([u, qType, newsline, solo=0, forum='', tag='', page=0, lastid='0', sessionid='', userslug='', tail=0, test='', breakCache='', size=0, card,isleft=false]: FetchQueueKey["key"]
) => {
   const addParams = (params: string) => {
      if (userslug)
         params += `&userslug=${userslug}`;
      if (sessionid)
         params += `&sessionid=${sessionid}`;
      if (solo == 1) {
         params += `&tag=${tag}&solo=1`
      }
      if (tail)
         params += `&tail=${tail}`;
      if (isleft)
         params += `&isleft=${isleft}`;   
      if (test)
         params += '&test=1';   //silo 4 
      if (u == 'notif')
         params += '&countonly=1'; //always the last for easier visibility in the dev tools   
      return params;
   }
   let params;
 
   switch (qType) {
      case 'newsline':
         params = `newsline=${newsline}&type=newsline&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
      case 'reacts':
         params = `forum=${forum}&type=reacts&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
      case 'mix':
         params = `newsline=${newsline}&forum=${forum}&type=mix&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
      case 'hot':
         params = `newsline=${newsline}&type=hot&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
      case 'tag':
         params = `newsline=${newsline}&tag=${tag}&type=tag&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
      case 'topics':
         params = `forum=${forum}&type=topics&page=${page}&lastid=${lastid}&size=${size}`;
         params = addParams(params);
         break;
   }
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/queue/fetch?${params}`;

   let res;
   try {
      res = await axios.get(url);
      if(u=='notif'&&isleft&&lastid&&lastid!='0'){
         const argUrl=url;
         const urlSave=`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/setSubscriptionUrl`;
         axios.post(urlSave,{sessionid,url:argUrl});
      }
   }
   catch (x) {
      res = await axios.get(url);
   }
   return res ? res.data : null;
}
//--------------------------------------------------

/**
 * SWR - navigator functions
 * 
 */
export type fetchMyNewslineKey = [u: string, newsline: string, sessionid: string, userslug: string, hasNewsline: boolean];
export const fetchMyNewsline = async ([u, newsline, sessionid, userslug, hasNewsline]: fetchMyNewslineKey) => {
    if (!hasNewsline)
      sessionid = "";
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetch?navigator=1`
   let res;
   try {
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug
      })
   }
   catch (x) {
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug
      })
   }
   const data = res ? res.data : null;
   if (data?.success) {
      return data.newsline;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)
   }
}
export type Filters = { [key: string]: boolean };
export type fetchPublicationsKey = [u: string, newsline: string, sessionid: string, userslug: string, filters: Filters, q: string, hasNewsline: boolean];
const filterValues = (filters: Filters) => {
   const filterKeys: string[] = Object.keys(filters);
   let out: string[] = [];
   for (let i = 0; i < filterKeys.length; i++) {
      if (filters[filterKeys[i]])
         out.push(filterKeys[i])
   }
   return out;
}
export const fetchPublications = async ([u, newsline, sessionid, userslug, filters, q='', hasNewsline]: fetchPublicationsKey) => {

   if (!hasNewsline)
      sessionid = '';
 
   let outFilters: string[] = []
   if (filters)
      outFilters = filterValues(filters)

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetchAll`
   let res;
   try {
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug,
         filters: outFilters,
         q
      })
   }
   catch (x) {
      console.log("fetchMyNewsline HANDLED EXCEPTION:", x)
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug,
         filters: outFilters,
         q
      })
      console.log("retried successfully")
   }
   const data = res ? res.data : null;
   if (data?.success) {
      return data.publications;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)
   }
}
export const fetchPublicationCategories = async ([u, newsline,]: [u: string, newsline: string]) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetchPublicationCategories`

   let res;
   try {
      res = await axios.post(url, {
         newsline
      })
   }
   catch (x) {
      console.log("fetchPublicationCategories HANDLED EXCEPTION:", x)
      res = await axios.post(url, {
         newsline
      })
      console.log("retried successfully")
   }
   const data = res ? res.data : null;

   if (data?.success) {
      return data.publicationCategories;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}
export const updateMyNewsline = async ({ newsline, tag, switch: switchParam, sessionid, userslug }: { newsline: string, tag: string, switch: string, sessionid: string, userslug: string }) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/update`
   console.log("calling lakeApi update, ", url, sessionid, userslug)
   let res;
   try {
      res = await axios.post(url, {
         newsline,
         tag,
         switch: switchParam,
         sessionid,
         userslug
      })
   }
   catch (x) {
      console.log("updateMyNewsline EXCEPTION:", x)
   }
   const data = res ? res.data : null;
   if (data?.success) {
      return data.newsline;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)
   }
}
export const updatePublications = async ({ newsline, tag, switch: switchParam, filters, q, sessionid, userslug }: { newsline: string, tag: string, switch: string, filters: Filters, q: string, sessionid: string, userslug: string }) => {
   let outFilters: string[] = []
   if (filters)
      outFilters = filterValues(filters);

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/updateAll`

   let res;
   try {
      res = await axios.post(url, {
         newsline,
         tag,
         sessionid,
         userslug,
         q,
         switch: switchParam,
         filters: outFilters,
      })
   }
   catch (x) {
      console.log("updatePublications  EXCEPTION:", x)
   }
   const data = res ? res.data : null;

   if (data?.success) {
      return data.publications;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)
   }
}
export const fetchNotificationsStatus = async ({sessionid}: {sessionid: string}) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetchNotificationsStatus`

   let res;
   try {
      res = await axios.post(url, {
         sessionid
      })
   }
   catch (x) {
      console.log("fetchPublicationCategories HANDLED EXCEPTION:", x)
   }
   const data = res ? res.data : null;

   if (data?.success) {
      return data.status;
   }
   else {
      console.log("ERROR in fetchNotificationsStatus:", data?.msg)

   }
}
export const subscribe = async ({sessionid,subscription,subscription_options}: {sessionid: string,subscription:any,subscription_options:any}) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/subscribe`

   let res;
   console.log("subscribe url:",url,sessionid,subscription,subscription_options)
   try {
      res = await axios.post(url, {
         sessionid,
         subscription,
         subscription_options

      })
   }
   catch (x) {
      console.log("subscribe HANDLED EXCEPTION:", x)
   }
   const data = res ? res.data : null;

   if (data?.success) {
      return data.status;
   }
   else {
      console.log("ERROR in subscribe:", data?.msg)

   }
}
//--------------------------------------------------