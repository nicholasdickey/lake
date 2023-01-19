import getLayoutWidth from './layoutWidth';
import { Qparams } from './qparams';
import { Options } from './withSession';
import { fetchQueue } from './lakeApi';
import { unstable_serialize } from 'swr';

export const fetchQueues = async ({ width, layout, qparams, session }: { width: number, layout: any, qparams: Qparams, session: Options }) => {
  const resWidth = getLayoutWidth(width);
  const res = `w${resWidth}`;
  console.log("INSIDE FETCH QUEUES",qparams)
  // console.log("fetchQueues",layout,res)
  let layres = layout.layoutView[res];
  //  console.log("layres",layres)
  let columns = layres.columns;
  columns.forEach((c:any) => console.log("column:", c))
  const qTypes = columns.map((c: any) => c.selector == 'newsviews' ? 'mix' : c.selector);
  let result: any = {};
  const sessionid = session.hasNewslines ? session.sessionid : '';
  for (let i = 0; i < qTypes.length; i++) {
    const qType = qTypes[i];
    console.log("fetchQueues qType:", qType)
    if (!qType) {
      console.log("************************************************************* ERROR no type i=", i, qTypes)
    }
    if (qType == 'twitter')
      continue;
    let type = qType;
    if (qType == 'topic')
      type = 'tag';
    // qTypes.forEach(async (qType:string) => {
    console.log("==============>getKey:", `['queue',qType:${qType},newsline:${qparams.newsline},forum:${qparams.forum},tag:${qparams.forum},pageIndex:${0},lastid:${0},sessionid:${session.sessionid},userslug:${session.userslug},tail:${''}]`)
    const key = ['queue', type, qparams.newsline, qparams.forum, qparams.tag, 0, 0, sessionid, session.userslug, '','',''] as unknown as [u: string, qType: string, newsline: string, forum: string, tag: string, page: number, lastid: string, sessionid: string, userslug: string, tail: number, test: string,breakCache:string];
    const r = await fetchQueue(key); //to be parallelized with Promise.All

    // console.log("fetchQueues result add",unstable_serialize(key),key,r)
    result[unstable_serialize(key)] ={fallback:true};// r;
  }
  if (session.band) {
    const key = ['queue', 'hot', qparams.newsline, qparams.forum, qparams.tag, 0, 0, sessionid, session.userslug, '',''] as unknown as [u: string, qType: string, newsline: string, forum: string, tag: string, page: number, lastid: string, sessionid: string, userslug: string, tail: string, test: string,breakCache:string];
   // const r = await fetchQueue(key);
    console.log("hotlist key", key)
    result[unstable_serialize(key)] ={fallback:true};// r;
  }
  return result;
}

