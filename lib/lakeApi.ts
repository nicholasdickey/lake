
import axios from 'axios'
import { off } from 'process';
import { Options } from '../lib/withSession';
const API_KEY = process.env.API_KEY;


export interface OnlineCountKey {
   sessionid: string,
   userslug: string
}
export const getOnlineCount = async (key: OnlineCountKey) => {
   const { sessionid, userslug } = key;
   //console.log("getOnlineCount:",sessionid,userslug,key)
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/onlineCount?sessionid=${encodeURIComponent(sessionid)}&userslug=${encodeURIComponent(userslug)}`;
   // console.log("calling lakeApi user/onlineCount ", url)
   const res = await axios.get(url);
   //console.log("getOnlineCount return",res.data)
   if (res.data.success)
      return res.data.count;
   else
      return undefined;
}
const lakeApi = (url: string) => {
   url = `${process.env.NEXT_PUBLIC_LAKEAPI}${url}`
   //console.log("calling lakeApi, ",url)
   return axios.get(url).then(res => res.data)
}
export const fetchAllSitemaps = async (newsline: string, forum: string) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/sitemap/fetchAll?newsline=${newsline}&forum=${forum}`;
   console.log("calling lakeApi fetchAllSitemaps ", url)
   const res = await axios.get(url);
   return res.data.sitemaps;
}
export const fetchSitemap = async (newsline: string, startDate: string) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/sitemap/fetch?newsline=${newsline}&startDate=${startDate}`;
   console.log("calling lakeApi fetchSitemap ", url)
   const res = await axios.get(url);
   return res.data.sitemap;
}
export const updateUserSession = async (userslug: string, options: Options) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/updateSession?`
   //console.log("calling lakeApi user/updateSession ", url)
   const res = await axios.post(url, {
      userslug,
      options
   });
   return res.data.userSession;
}
export const getUserSession = async (userslug: string) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetchSession?`
   // console.log("calling lakeApi user/fetchSession ", url)
   const res = await axios.post(url, {
      userslug
   });
   return res.data.userSession;
}
export const initLoginSession = async (userslug: string, options: Options) => {
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/initLogin?`
   //console.log("calling lakeApi user/initLogin ", url)
   const res = await axios.post(url, {
      userslug,
      options
   });
   console.log("initLogin returned", res.data)
   return JSON.parse(res.data.userSession) || null;
}

export const processLoginCode = async (code: string, host: string) => {
   const url = `${process.env.NEXT_PUBLIC_QWIKET_API}/api?task=disqus-login&code=${code}&host=${host}`;

   const res = await axios.get(url);
   //console.log("processLoginCode returned from axios get ",url,res.data)
   if (res.data.success) {
      const user = res.data.user;
      return user;
   }
   return false;
}
export const fetchChannelConfig = async (slug: string) => {
   try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/channel/fetch?slug=${slug}`
      //  console.log("calling lakeApi fetchChannelConfig ", url)
      const res = await axios.get(url);
      //  console.log("returned from axios get ",url,res.data)
      return res.data
   }
   catch (x) {
      console.log("fetchChannelConfig EXCEPTION", x)
   }
   return null
}
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

export default lakeApi;

export const fetchUser = async ([u, userslug]: [u: string, userslug: string]) => {
   try {
      // console.log("fetchUser client",u,userslug)
      if (!userslug)
         return null
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetch?userslug=${userslug}`
      // console.log("calling lakeApi, ",url)
      const res = await axios.get(url);
      return res.data.user;
   }
   catch (x) {
      console.log("EXCEPTION in fetchUser", x)
   }
   return null;
}
export type FetchTopicKey = [u: string, threadid: string, withBody: number, userslug: string, tag: string];
export const fetchTopic = async ([u, threadid, withBody, userslug, tag]: FetchTopicKey) => {
   if (!userslug)
      userslug = '';
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/topic/fetch?slug=${encodeURIComponent(threadid)}&withBody=${withBody}&userslug=${userslug}&tag=${tag}`;
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
export interface FetchQueueKey {
   key: [u: string, qType: string, newsline: string, solo: number, forum?: string, tag?: string, page?: number, lastid?: string, sessionid?: string, userslug?: string, tail?: number, test?: string, breakCache?: string, size?: number, card?: string]
}
export const fetchQueue = async ([u, qType, newsline, solo, forum, tag, page, lastid, sessionid, userslug, tail, test, breakCache, size, card]: FetchQueueKey["key"]
) => {
   let params;
   //console.log("fetchQueue d1b",JSON.stringify({u,qType,newsline,solo,forum,tag,page,lastid,sessionid,userslug,tail,test,breakCache,size,card}))
   //console.log("d1b:  fetchQueue:", `['queue',card:${card},qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)
   if (!page)
      page = 0;
   if (!size)
      size = 0;
   if (!lastid)
      lastid = '0';
   if (!forum) forum = '';
   if (!tag)
      tag = ''
   if (!sessionid)
      sessionid = '';
   if (!userslug)
      userslug = '';
   if (!tail)
      tail = 0;
   if (!test)
      test = '';
   if (!breakCache)
      breakCache = '';
   if (!solo)
      solo = 0;

   const addParams = (params: string) => {
      //  console.log("addParams1",params)
      if (userslug)
         params += `&userslug=${userslug}`;
      else if (sessionid)
         params += `&sessionid=${sessionid}`;
      if (solo == 1) {
         params += `&tag=${tag}&solo=1`
      }
      if (tail)
         params += `&tail=${tail}`;
      if (test)
         params += '&test=1';   //silo 4 
      if (u == 'notif')
         params += '&countonly=1'; //always the last for easier visibility in the dev tools   
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
         params = addParams(params);
         break;
      case 'hot':
         params = `newsline=${newsline}&type=hot&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         // console.log("fetchQueue params",params)
         break;
      case 'tag':
         params = `newsline=${newsline}&tag=${tag}&type=tag&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
      case 'topics':
         params = `forum=${forum}&type=topics&page=${page}&lastid=${lastid}`;
         params = addParams(params);
         break;
   }
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/queue/fetch?${params}`

   // console.log("remder fetchQueue url",url)
   let res;
   try {
      res = await axios.get(url)
   }
   catch (x) {
      console.log("fetchQueue HANDLED EXCEPTION:", x)
      res = await axios.get(url)
      console.log("retried successfully")
   }
   //console.log("remder return ",res.data)
   return res ? res.data : null;
}
export type fetchMyNewslineKey = [u: string, newsline: string, sessionid: string, userslug: string, hasNewsline: boolean];
export const fetchMyNewsline = async ([u, newsline, sessionid, userslug, hasNewsline]: fetchMyNewslineKey) => {
   let params;
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)
   if (!hasNewsline)
      sessionid = "";

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetch?navigator=1`
   //  console.log("calling lakeApi fetchNAvigator, ", url)
   let res;
   try {
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug
      })
   }
   catch (x) {
      console.log("fetchMyNewsline HANDLED EXCEPTION:", x)
      res = await axios.post(url, {
         newsline,
         sessionid,
         userslug
      })
      console.log("retried successfully")
   }
   const data = res ? res.data : null;
   // console.log("inside fetchNavigator", data);
   // console.log("newsline:", data.newsline)
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
      //console.log("filterValues iter", i, filterKeys[i], filters[filterKeys[i]])
      if (filters[filterKeys[i]])
         out.push(filterKeys[i])
   }
   //  console.log("filterValues out:", out)
   return out;
}
export const fetchPublications = async ([u, newsline, sessionid, userslug, filters, q, hasNewsline]: fetchPublicationsKey) => {
   let params;
   if (!hasNewsline)
      sessionid = '';
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)
   interface FiltersArray {
      [key: string]: string;
   }

   let outFilters: string[] = []
   if (filters)
      outFilters = filterValues(filters)

   if (!q)
      q = "";
   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetchAll`
   //  console.log("calling lakeApi fetchAll, ", url, outFilters, q)
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
   //console.log("inside fetchPublications", data);
   //console.log("publications:", data.publications)
   if (data?.success) {
      return data.publications;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}
export const fetchPublicationCategories = async ([u, newsline,]: [u: string, newsline: string]) => {
   let params;
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)


   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetchPublicationCategories`
   // console.log("calling lakeApi fetchPublicationCategories, ", url)
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
   // console.log("inside fetchPublicationCategories", data);
   // console.log("publicationCategories:", data.publicationCategories)
   if (data?.success) {
      return data.publicationCategories;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}
export const updateMyNewsline = async ({ newsline, tag, switch: switchParam, sessionid, userslug }: { newsline: string, tag: string, switch: string, sessionid: string, userslug: string }) => {
   let params;
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)


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
   // console.log("inside updateMyNewsline", data);
   // console.log("newsline:", data.newsline)
   if (data?.success) {
      return data.newsline;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}
export const updatePublications = async ({ newsline, tag, switch: switchParam, filters, q, sessionid, userslug }: { newsline: string, tag: string, switch: string, filters: Filters, q: string, sessionid: string, userslug: string }) => {
   let params;
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)

   let outFilters: string[] = []
   if (filters)
      outFilters = filterValues(filters);

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/updateAll`
   console.log(" calling lakeApi updateAll, ", url, sessionid,)
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
   // console.log("inside updatePublications", data);
   //  console.log("publications:", data.publications)
   if (data?.success) {
      return data.publications;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}