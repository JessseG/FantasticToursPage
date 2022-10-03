import nodemailer from "nodemailer";
import mail from "@sendgrid/mail";
import prisma from "../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, email_subject, html_message } = req.body;

  // const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  // const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  if (process.env.SENDGRID_API_KEY) {
    mail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: [email, "info@miamifantastictours.com", "fantastictoursfl@gmail.com"],
      from: {
        name: "Fantastic Tours",
        email: "info@miamifantastictours.com",
      },
      subject: email_subject,
      html: html_message,
    };

    try {
      await mail
        .send(msg)
        .then(async (response: any) => {
          // console.log(response);
          if (response) {
            return res.json(response);
          }
          // }
        })
        .catch(async (error) => {
          // console.log(error);
          return res.json(error);
        });
    } catch (e: any) {
      // console.log(e);
      return res.status(e.statusCode || 500).json({ error: e.message });
    }
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ionos.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //   tls: {
    //     rejectUnauthorized: true,
    //   },
    //   // dkim: {
    //   //   keySelector: "2017",
    //   //   domainName: "healwell.io",
    //   //   privateKey: process.env.DKIM_PK,
    //   // },
    // });
    // // transporter.verify(function (error, success) {
    // //   if (error) {
    // //     console.log(error);
    // //   } else {
    // //     console.log("Server is ready to take our messages");
    // //   }
    // // });
    // const mailOptions = {
    //   from: {
    //     name: "Fantastic Tours",
    //     address: "info@miamifantastictours.com",
    //   },
    //   to: [email, "info@miamifantastictours.com", "fantastictoursfl@gmail.com"],
    //   subject: email_subject,
    //   html: html_message,
    // };
    // await transporter.sendMail(
    //   mailOptions,
    //   async function (error: any, info: any) {
    //     if (error) {
    //       return res.json(error);
    //     } else {
    //       return res.json(info.response);
    //     }
    //   }
    // );
  }
};

export default handler;
