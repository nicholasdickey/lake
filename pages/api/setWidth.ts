// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute,Options } from "../../lib/withSession";

export default withSessionRoute(handler);

 async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    let options:Options=req.session.options?req.session.options:({width:0} as Options);
    let width=req.query.width?(req.query.width):3500;
    options.width=+width;

    req.session.options =options;
    await req.session.save();

  res.status(200).json({})
}
