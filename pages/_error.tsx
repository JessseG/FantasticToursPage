import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const Error = ({ statusCode }: any) => {
  return (
    <div className="m-auto">
      <h1 className="inline-block m-0 mr-[20px] pr-[23px] text-[24px] font-medium align-top leading-[49px] border-r border-white/[0.35]">
        {statusCode}
      </h1>
      <div className="inline-block text-left leading-[49px] h-[49px] align-middle">
        <h2 className="text-[15px] font-normal leading-[49px] m-0 p-0">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </h2>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ req, res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
