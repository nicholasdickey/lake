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
   let {appid=1013,href='/'}=req.query;
   const state=encodeURIComponent(`{"href":"${href}"}`);
   const url = `${process.env.NEXT_PUBLIC_QWIKET_API}/api?task=disqus-login&appid=${appid}&state=${state}`;
   console.log("LOGIN API:",url)
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
