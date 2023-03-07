// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute, Options } from "../../../lib/with-session";
import axios from 'axios'

const API_KEY = process.env.API_KEY;

export default withSessionRoute(handler);
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
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    let options: Options = req.session.options ? req.session.options : ({ width: 0} as Options);
  
    const {newsline,tag,switch:switchParam}:{newsline:string,tag:string,switch:string} = req.body;
    if(!options.sessionid)
        options.sessionid=randomstring(); 
    const userslug=options.userslug||"";
    const sessionid=options.sessionid;
    
    req.session.options = options;

    await req.session.save();

    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/update?navigator=1`
   
    let result;
    try {
        result = await axios.post(url, {
          newsline,
          sessionid,
          userslug,
          tag,
          switch:switchParam,
          api_key:API_KEY
       })
    }
    catch(x){
        console.log(x)
    }
 
    res.status(200).json(result?.data)
}
