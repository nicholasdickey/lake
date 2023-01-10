
import axios from 'axios'

const API_KEY = process.env.API_KEY;

const lakeApi = (url: string) => {
   url = `${process.env.NEXT_PUBLIC_LAKEAPI}${url}`
   //console.log("calling lakeApi, ",url)
   return axios.get(url).then(res => res.data)
}
export const fetchChannelConfig = async (slug: string) => {
   try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/channel/fetch?slug=${slug}`
      // console.log("calling lakeApi fetchChannelConfig ", url)
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
      // console.log("calling lakeApi fetchChannelLayout, ", url)
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
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)

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
   //  console.log("calling lakeApi fetchQueue, ", url)
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
export type fetchMyNewslineKey= [u: string, newsline: string, sessionid: string, userslug: string, hasNewsline: boolean];
export const fetchMyNewsline = async ([u, newsline, sessionid, userslug, hasNewsline]:fetchMyNewslineKey) => {
   let params;
   //   console.log("fetchQueue:", `['queue',qType:${qType},newsline:${newsline},forum:${forum},tag:${tag},page:${page},lastid:${lastid},sessionid:${sessionid},userslug:${userslug},tail:${tail}]`)
   if (!hasNewsline)
      sessionid = "";

   const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/fetch?navigator=1`
   console.log("calling lakeApi fetchNAvigator, ", url)
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
   console.log("inside fetchNavigator", data);
   console.log("newsline:", data.newsline)
   if (data?.success) {
      return data.newsline;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}
export type Filters= { [key: string]: boolean };
export type fetchPublicationsKey = [u: string, newsline: string, sessionid: string, userslug: string, filters:Filters, q: string, hasNewsline: boolean];
const filterValues = (filters: { [key: string]: boolean }) => {
   const filterKeys:string[] = Object.keys(filters);
   let out: string[] = [];
   for (let i = 0; i < filterKeys.length; i++) {
      console.log("filterValues iter", i, filterKeys[i], filters[filterKeys[i]])
      if (filters[filterKeys[i]])
         out.push(filterKeys[i])
   }
   console.log("filterValues out:", out)
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
   console.log("calling lakeApi fetchAll, ", url, outFilters, q)
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
   console.log("calling lakeApi fetchPublicationCategories, ", url)
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
   console.log("calling lakeApi update, ", url)
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
   console.log("inside updateMyNewsline", data);
   console.log("newsline:", data.newsline)
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
   console.log(" calling lakeApi updateAll, ", url)
   let res;
   try {
      res = await axios.post(url, {
         newsline,
         tag,
         switch: switchParam,
         filters:outFilters,
         q
      })
   }
   catch (x) {
      console.log("updatePublications  EXCEPTION:", x)

   }
   const data = res ? res.data : null;
   console.log("inside updatePublications", data);
   console.log("publications:", data.publications)
   if (data?.success) {
      return data.publications;
   }
   else {
      console.log("ERROR in getchMyNewsline:", data.msg)

   }
}