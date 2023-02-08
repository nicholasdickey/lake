// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute, Options } from "../../../lib/withSession";
export default withSessionRoute(handler);
import axios from 'axios';
var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
/**
 * Note: the incoming session object could be only partial, will be merged over existing session
 * 
 * @param req 
 * 
 * @param res 
 * @returns 
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
   // let options: Options = req.session.options ;
   // const {sessionid}=options;
   let {appid,href='/'}=req.query;
   console.log("login: host=",req.headers.host)
   const host=req.headers.host||'am1.news';
   //if(!appid)
   //appid=process.env.NEXT_PUBLIC_APPID||'1013';
   if(!appid)
   appid='1003';
   const state=encodeURIComponent(`{"href":"${href}"}`);
   const url = `${process.env.NEXT_PUBLIC_QWIKET_API}/api?task=disqus-login&appid=${appid}&state=${state}&host=${encodeURIComponent(host)}`;
   console.log("LOGIN API:",url)
   return res.status(200).json({url});
   let result;
   try {
       result = await axios.get(url);     
   }
   catch(x){
       console.log(x)
   }
   const json=result?.data;
   console.log("DISQUS-LOGIN", json);
   console.log(JSON.stringify({ json }));

   if (json.success) {
       console.log("success");
       const redirect = json.redirect;
       return res.redirect(redirect);
   } else {
       return res.status(500).json(json);
   }
}

