// import prisma from "../../db";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { isMobile } from "react-device-detect";
import moment from "moment";
// import htmlEmail from "./email.html";
import { google } from "googleapis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { GOOGLE_CALENDAR_API_KEY, GOOGLE_CALENDAR_ID } = process.env;

    // if(process.env.GOOGLE_CALENDAR_ID)

    const BASEPARAMS = `orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;

    const BASEURL = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?${BASEPARAMS}`;

    const finalURL = `${BASEURL}&key=${GOOGLE_CALENDAR_API_KEY}`;

    try {
      await fetch(finalURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET",
        },
      })
        .then(async (response) => await response.json())
        .then(async (data) => {
          console.log(data);
          console.log(data.items);
          return res.status(200).json({ data: data.items });
        });
    } catch (e) {
      return res.status(500).json({ message: "Emailer Error", error: e });
    }
  } else {
    return res.status(405).json({ message: "GET Only" });
  }
};

export default handler;
