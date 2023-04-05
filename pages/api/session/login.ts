// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute} from "../../../lib/with-session";
export default withSessionRoute(handler);
import axios from 'axios';

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

    let { appid = '', href = '/' } = req.query;

    const host = req.headers.host || 'am1.news';
    const state = encodeURIComponent(`{"href":"${href}"}`);
    const url = `${process.env.NEXT_PUBLIC_QWIKET_API}/api?task=disqus-login&appid=${appid}&state=${state}&host=${encodeURIComponent(host)}`;
   // console.log("/api/session/login:",url)
    let json;
    try {
        const result = await axios.get(url);
        json = result?.data;
       // console.log("api return:",json)
    }
    catch (x) {
        console.log(x)
    }
    if (json && json.success) {
        //disqus-login api returns a redirect to disqus - phase 1 of OAuth two-step
        const redirect = json.redirect;
       // console.log("calling redirect",redirect)
        try{
           const ret=await res.redirect(redirect);
         
        }
        catch(x){
            console.log("redirect exception",x)
        }
    } else {
        return res.status(500).json(json);
    }
}

