// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute, Options } from "../../../lib/withSession";

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
    console.log("inside newsline update handler",req.body)
  
    const {newsline,tag,switch:switchParam}:{newsline:string,tag:string,switch:string} = req.body;
    if(!options.sessionid)
        options.sessionid=randomstring();  //means there is server footprint for this session
    const userslug=options.userslug||"";
    const sessionid=options.sessionid;
    
    req.session.options = options;//Object.assign(options, );

    await req.session.save();

    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/newsline/update?navigator=1`
   // console.log("calling lakeApi fetchNAvigator, ", url)
    let result;
    try {
        result = await axios.post(url, {
          newsline,
          sessionid,
          userslug,
          tag,
          switch:switchParam
       })
    }
    catch(x){
        console.log(x)
    }
    console.log("API got result from lake-api:",result?.data)
    res.status(200).json(result?.data)
}
