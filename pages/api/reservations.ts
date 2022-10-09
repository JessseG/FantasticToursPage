import prisma from "../../db";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { isMobile } from "react-device-detect";
import moment from "moment";
// import htmlEmail from "./email.html";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { preReservation } = req.body;

  // console.log(htmlEmail);
  // console.log("pre: ", preReservation);

  if (req.method === "POST") {
    // First Validate all the entries
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !preReservation.name ||
      /^\s*$/.test(preReservation.name) ||
      !preReservation.email ||
      !regexp.test(preReservation.email) ||
      preReservation.hotel === null ||
      preReservation.tour === null ||
      preReservation.phone === "" ||
      preReservation.phone === "" ||
      preReservation.phone.length < 10 ||
      preReservation.date === null ||
      preReservation.time === null ||
      preReservation.numAdults === 0 ||
      preReservation.totalPrice === 0 ||
      (preReservation.depositPaid && preReservation.depositAmount === "") ||
      (preReservation.depositPaid &&
        parseInt(preReservation.depositAmount)! <= 0) ||
      preReservation.balance === 0
    ) {
      return res.status(500).json({ error: "Invalid entry" });
    }

    // try {
    try {
      var pendReservation = await prisma.pendReservation.create({
        data: preReservation,
        select: {
          id: true,
        },
      });
    } catch (e) {
      // console.log("Error: ", e);
      return res.status(500).json({ message: "Prisma Error", error: e });
    }

    if (pendReservation && pendReservation.id) {
      // Some simple styling options
      const backgroundColor = "#f4f4f4";
      const textColor = "#444444";
      const mainBackgroundColor = "#ffffff";
      const buttonBackgroundColor = "#346df1";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "#ffffff";

      const rsvpDate = new Date(preReservation.rsvpDate)?.toLocaleDateString(
        "en-us",
        {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

      const rsvpTime = new Date(preReservation.rsvpTime)?.toLocaleTimeString(
        "en-us",
        {
          hour: "numeric",
          minute: "numeric",
        }
      );

      // After a pending user is created successfully, then do this below
      // if (pendUser) {
      const email_subject = "Reservation Confirmation";

      const oddRowColor = "#f5f5f5";
      const evenRowColor = "white";

      const preRowStyle = [
        { show: true, style: { rowColor: "" }, type: "Name" }, // Name
        { show: true, style: { rowColor: "" }, type: "Hotel" }, // Hotel
        { show: true, style: { rowColor: "" }, type: "Tour" }, // Tour
        { show: true, style: { rowColor: "" }, type: "Phone" }, // Phone
        { show: true, style: { rowColor: "" }, type: "Date" }, // Date
        { show: true, style: { rowColor: "" }, type: "Time" }, // Time
        { show: true, style: { rowColor: "" }, type: "Adults" }, // Adults
        {
          show: preReservation.numKids > 0,
          style: { rowColor: "" },
          type: "Kids",
        }, // Kids
        {
          show: preReservation.reservedBy !== "",
          style: { rowColor: "" },
          type: "ReservedBy",
        }, // ReservedBy
        {
          show: preReservation.roomNum !== "",
          style: { rowColor: "" },
          type: "Room",
        }, // Room
        {
          show: preReservation.details !== "",
          style: { rowColor: "" },
          type: "Details",
        }, // Details
        { show: true, style: { rowColor: "" }, type: "Total" }, // Total
        {
          show: preReservation.depositPaid,
          style: { rowColor: "" },
          type: "Deposit",
        }, // Deposit
        {
          show: preReservation.depositPaid,
          style: { rowColor: "" },
          type: "Balance",
        }, // Balance
      ];

      let i = 0;
      const rowStyle = preRowStyle.map((row, index) => {
        if (row.show) {
          i++; // only increase count for the { show: true } rows
          if (i % 2 === 0) {
            row.style.rowColor = oddRowColor;
          } else if (i % 2 === 1) {
            row.style.rowColor = evenRowColor;
          }
          return row;
        } else {
          return row;
        }
        // console.log(row.type);
        // console.log(row.style.rowColor);
      });

      const html_message = `<!DOCTYPE html>
        <html>
          <head>
            <style>
              @media (prefers-color-scheme: dark) {
                .table-th {
                  color: white;
                }
              }
            </style>
          </head> 
          
          <body style="
                      background: white;
                      ">
            <table style="
                        width: 100%;
                        margin: auto;
                        border: none;
                        padding: 0;
                        border-spacing: 0;
                        border-collapse: separate;
                      ">
              <tbody>
                <tr>
                  <td style="
                              text-align: center;
                              padding: 10px 0px 20px 0px;
                              font-size: 22px;
                              font-family: Helvetica, Arial, sans-serif;
                              color: #444444;
                            "></td>
                </tr>
              </tbody>
            </table>
          
            <table style="
                          text-align: center;
                          width: 100%;
                          border: none;
                          padding: 0;
                          border-spacing: 20;
                          border-collapse: separate;
                        ">
              <tbody>
                <tr>
                  <td style="
                              text-align: center;
                              padding: 2.5rem 0px 0px 0px;
                              font-size: 1.4rem;
                              font-family: Helvetica, Arial, sans-serif;
                              color: #444444;
                            ">
                    <strong>Thank you for Reserving with Fantastic Tours!</strong>
                  </td>
                </tr>
                <tr>
                  <td style="
                              text-align: center;
                              padding: 10px 0px 10px 0px;
                              font-size: 15px;
                              font-family: Helvetica, Arial, sans-serif;
                              color: #444444;
                            ">
                    Here are all your reservation details
                  </td>
                </tr>
                <tr>
                  <td>
                    <table style="
                                border: none;
                                text-align: center;
                                margin-right: auto;
                                margin-left: auto;
                                font-family: Arial, Helvetica, sans-serif;
                                border-collapse: collapse;
                                width: 87%;
                                max-width: 650px;
                              ">
                      <tbody>
                        <tr style="background-color: #758aff;">
                          <th class="table-th" style="
                                      border-top-left-radius: 0.27rem;
                                      text-align: center;
                                      padding-top: 12px;
                                      padding-bottom: 12px;
                                      color: white;
                                      padding: 8px;
                                      width: 35%;
                                    ">
                            Info
                          </th>
                          <th class="table-th" style="
                                      border-top-right-radius: 0.27rem;
                                      text-align: center;
                                      padding-top: 12px;
                                      padding-bottom: 12px;
                                      color: white;
                                      padding: 8px;
                                    ">
                            Details
                          </th>
                        </tr>
                        <tr style=" 
                                    background-color: ${
                                      rowStyle[0].style.rowColor
                                    };
                                  ">
                          <td style="
                                      font-weight: 600;
                                      border: 1px solid #ddd;
                                      border-left-width: 1px;
                                      padding: 8px;
                                    ">
                            Name
                          </td>
                          <td style="
                                      border: 1px solid #ddd;
                                      border-right-width: 1px;
                                      padding: 8px;
                                    ">
                            ${preReservation.name}
                          </td>
                        </tr>
                        <tr style="
                                    background-color: ${
                                      rowStyle[1].style.rowColor
                                    };
                                  ">
                          <td style="
                                      font-weight: 600;
                                      border: 1px solid #ddd;
                                      border-left-width: 1px;
                                      padding: 8px;
                                    ">
                            Hotel
                          </td>
                          <td style="
                                      border: 1px solid #ddd;
                                      border-right-width: 1px;
                                      padding: 8px;
                                      ">
                            ${preReservation.hotel}
                          </td>
                        </tr>
                        <tr style=" 
                                    background-color: ${
                                      rowStyle[2].style.rowColor
                                    };
                                  ">
                          <td style="
                                      font-weight: 600;
                                      border: 1px solid #ddd;
                                      border-left-width: 1px;
                                      padding: 8px;
                                    ">
                            Tour
                          </td>
                          <td style="
                                      border: 1px solid #ddd;
                                      border-right-width: 1px;
                                      padding: 8px;
                                    ">
                            ${preReservation.tour}
                          </td>
                        </tr>
                        <tr style="
                                    background-color: ${
                                      rowStyle[3].style.rowColor
                                    };
                                  ">
                          <td style="
                                      font-weight: 600;
                                      border: 1px solid #ddd;
                                      border-left-width: 1px;
                                      padding: 8px;
                                    ">
                            Phone
                          </td>
                          <td style="
                                      border: 1px solid #ddd" ; padding: 8px; border-right-width: 1px;">
                            ${preReservation.phone}
                          </td>
                        </tr>
                        <tr style=" 
                        background-color: ${rowStyle[4].style.rowColor};
                      ">
                          <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Date
                          </td>
                          <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            ${rsvpDate}
                          </td>
                        </tr>
                        <tr style=" background-color: ${
                          rowStyle[5].style.rowColor
                        }; ">
                          <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Time
                          </td>
                          <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            ${rsvpTime}
                          </td>
                        </tr>
                        <tr style=" 
                        background-color: ${rowStyle[6].style.rowColor};
                      ">
                          <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Adults
                          </td>
                          <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px; ">
                            ${preReservation.numAdults}
                          </td>
                        </tr>

                        ${
                          preReservation.numKids > 0
                            ? `
                        <tr style=" background-color: ${rowStyle[7].style.rowColor}; ">
                          <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Kids
                          </td>
                          <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            ${preReservation.numKids}
                          </td>
                        </tr>
                        `
                            : ``
                        }
          
                        ${
                          preReservation.reservedBy
                            ? `
                        <tr style=" 
                          background-color: ${rowStyle[8].style.rowColor};
                        ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
                          padding: 8px; border-left-width: 1px;">
                            ReservedBy
                          </td>
                          <td
                            style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            ${preReservation.reservedBy}
                          </td>
                        </tr>
                        `
                            : ``
                        }
                        ${
                          preReservation.roomNum
                            ? `
                        <tr style=" background-color: ${rowStyle[9].style.rowColor}; ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
                          padding: 8px; border-left-width: 1px;">
                            Room Num
                          </td>
                          <td
                            style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            ${preReservation.roomNum}
                          </td>
                        </tr>
                        `
                            : ``
                        }
                        ${
                          preReservation.details
                            ? `
                          <tr style=" 
                          background-color: ${rowStyle[10].style.rowColor};
                          ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
                          padding: 8px; border-left-width: 1px;">
                          Details
                          </td>
                          <td
                          style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                          ${preReservation.details}
                          </td>
                          </tr>
                          `
                            : ``
                        }
                        <tr style=" background-color: ${
                          rowStyle[11].style.rowColor
                        }; ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
                          padding: 8px; border-left-width: 1px;">
                            Total
                          </td>
                          <td
                            style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            $${preReservation.totalPrice}
                          </td>
                        </tr>

                        ${
                          preReservation.depositPaid
                            ? `
                        <tr style=" background-color: ${rowStyle[12].style.rowColor}; ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Deposit
                          </td>
                          <td style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                          $${preReservation.depositAmount}
                          </td>
                        </tr>
                        `
                            : ``
                        }

                        ${
                          preReservation.depositPaid
                            ? `
                        <tr style=" background-color: ${rowStyle[13].style.rowColor}; ">
                          <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
                            Balance
                          </td>
                          <td
                            style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
                            $${preReservation.balance}
                          </td>
                        </tr>
                        `
                            : ``
                        }

                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style=" height: 40px; display: flex; flex-direction: row; padding-top: 1.1rem;">
                  <td style=" padding-right: 10px; width: 50%; text-align: right;">
                    <a href=" ${
                      process.env.NEXTAUTH_URL
                    }/api/reservations/activate/${
        pendReservation.id
      }" target="_blank" style="
                      text-align: center;
                      border-radius: 5px;
                      background-color: #f7a116;
                      font-size: 14.5px;
                      font-family: Helvetica, Arial, sans-serif;
                      color: white;
                      text-decoration: none;
                      padding: 7px 15px;
                      border: 1px solid rgb(228, 228, 231);
                      display: inline-block;
                      font-weight: 600;
                    ">
                      Modify ${isMobile ? "" : "Reservation"}
                    </a>
                  </td>
          
                  <td style="padding-left: 10px; width: 50%; text-align: left;">
                    <a href="${
                      process.env.NEXTAUTH_URL
                    }/api/reservations/activate/${
        pendReservation.id
      }" target="_blank" style="
                      text-align: center;
                      border-radius: 5px;
                      background-color: #5f77ff;
                      font-size: 14.5px;
                      font-family: Helvetica, Arial, sans-serif;
                      color: white;
                      text-decoration: none;
                      padding: 7px 13px;
                      border: 1px solid #346df1;
                      display: inline-block;
                      font-weight: 600;
                      ">
                      Confirm ${isMobile ? "" : "Reservation"}
                    </a>
                  </td>
                </tr>
          
                <tr>
                  <td style="
                    text-align: center;
                    padding: 15px 0px 5px 0px;
                    text-decoration: underline;
                    font-size: 12.3px;
                    line-height: 17px;
                    font-family: Helvetica, Arial, sans-serif;
                    color: #444444;
                  ">
                    If you did not request this email you can safely ignore it.
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>`;

      try {
        // const sendEmail: AxiosRequestConfig = {};
        // if (sendEmail) {
        // const response = await axios(sendEmail);
        // }

        // let rootURL;
        // if (process.env.VERCEL) {
        //   rootURL = process.env.VERCEL_URL;
        // } else {
        //   rootURL = process.env.NEXTAUTH_URL;
        // }

        await axios({
          method: "POST",
          url: `${process.env.NEXTAUTH_URL}/api/mailer`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: {
            email: preReservation.email,
            email_subject: email_subject,
            html_message: html_message,
          },
        })
          .then(async function (response: any) {
            // console.log("axios response: ", response);
            // console.log("Axios Response data: ", response.data[0].statusCode);
            if (response.data[0].statusCode === 202) {
              return res.json({ status: "success" });
            }

            // // console.log("Axios Response data: ", response.data);
            // if (response.data) {
            // console.log("response status: ", response.status);
            //   return res.json({ status: "success" });
            // }
          })
          .catch(function (error: any) {
            // console.log("axios error: ", error);
            return res.json({
              status: "failure",
              error: error,
            });
          });
        // console.log("response: ", response.data);
      } catch (e) {
        // console.log("Error: ", e);
        return res.status(500).json({ message: "Emailer Error", error: e });
      }
    } else {
      return res.json({
        status: "failure",
        error: "Create Reservation Query Failed",
      });
    }
    // }
    // return res.json({ status: "success" });
  } else {
    return res.status(405).json({ message: "POST Only" });
  }
};

export default handler;
