import { google, Auth } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

const addCalendarEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const reservation = req.body.reservation;

  // console.log("reservation: ", reservation);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Google calendar API settings
  const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  var auth = new google.auth.JWT({
    email: process.env.GOOGLE_CALENDAR_EMAIL,
    keyId: process.env.GOOGLE_CALENDAR_PRIVATE_KEY_ID,
    key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
    scopes: SCOPES,
  });

  const calendar = google.calendar({ version: "v3" });

  // Your TIMEOFFSET Offset
  // const TIMEOFFSET = "+05:30";a

  // Get date-time string for calender
  // const dateTimeForCalander = () => {
  //   let date = new Date();

  //   let year = date.getFullYear();
  //   let month: any = date.getMonth() + 1;
  //   if (month < 10) {
  //     month = `0${month}`;
  //   }
  //   let day: any = date.getDate();
  //   if (day < 10) {
  //     day = `0${day}`;
  //   }
  //   let hour: any = date.getHours();
  //   if (hour < 10) {
  //     hour = `0${hour}`;
  //   }
  //   let minute: any = date.getMinutes();
  //   if (minute < 10) {
  //     minute = `0${minute}`;
  //   }

  //   let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

  //   let event = new Date(Date.parse(newDateTime));

  //   let startDate = event;
  //   // Delay in end time is 1
  //   let endDate = new Date(
  //     new Date(startDate).setHours(startDate.getHours() + 1)
  //   );

  //   return {
  //     start: startDate,
  //     end: endDate,
  //   };
  // };

  const joinDateTimes = (date: any, time: any) => {
    let joinedDateTimes = `${date.split("T")[0]}T${time.split("T")[1]}`;
    // console.log("Start Time: ", joinedDateTimes);
    return joinedDateTimes;
  };

  const addOneHour = (dateTime: any) => {
    let baseDate = new Date(dateTime);
    baseDate.setHours(baseDate.getHours() + 1);
    // console.log("End Time: ", baseDate.toISOString());
    return baseDate.toISOString();
  };

  // console.log(
  //   "Joined Times: ",
  //   joinDateTimes(reservation.rsvpDate, reservation.rsvpTime)
  // );

  // Insert new event to Google Calendar
  const insertEvent = async () => {
    try {
      // let dateTime = dateTimeForCalander();

      // var event1 = {
      //   summary: "Google I/O 2015",
      //   location: "800 Howard St., San Francisco, CA 94103",
      //   description: "A chance to hear more about Google's developer products.",
      //   start: {
      //     dateTime: "2015-05-28T09:00:00-07:00",
      //     timeZone: "America/Los_Angeles",
      //   },
      //   end: {
      //     dateTime: "2015-05-28T17:00:00-07:00",
      //     timeZone: "America/Los_Angeles",
      //   },
      //   recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      //   reminders: {
      //     useDefault: false,
      //     overrides: [
      //       { method: "email", minutes: 24 * 60 },
      //       { method: "popup", minutes: 10 },
      //     ],
      //   },
      // };

      const rsvpDate = new Date(reservation.rsvpDate)?.toLocaleDateString(
        "en-us",
        {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/New_York",
        }
      );

      const rsvpTime = new Date(reservation.rsvpTime)?.toLocaleTimeString(
        "en-us",
        {
          hour: "numeric",
          minute: "numeric",
          timeZone: "America/New_York",
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
          show: reservation.numKids > 0,
          style: { rowColor: "" },
          type: "Kids",
        }, // Kids
        {
          show: reservation.reservedBy !== "",
          style: { rowColor: "" },
          type: "ReservedBy",
        }, // ReservedBy
        {
          show: reservation.roomNum !== "",
          style: { rowColor: "" },
          type: "Room",
        }, // Room
        {
          show: reservation.details !== "",
          style: { rowColor: "" },
          type: "Details",
        }, // Details
        { show: true, style: { rowColor: "" }, type: "Total" }, // Total
        {
          show: reservation.depositPaid,
          style: { rowColor: "" },
          type: "Deposit",
        }, // Deposit
        {
          show: reservation.depositPaid,
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

      const html_description = `<h3>Reservation Details</h3>\n
        <table>
          <tr>
              <td><b>Name</b></td>
              <td>\t${reservation.name}</td>
          </tr>
          <tr>
              <td><b>Phone</b></td>
              <td>\t${reservation.phone}</td>
          </tr>
          <tr>
              <td><b>Email</b></td>
              <td>\t${reservation.email}</td>
          </tr>\n
          <tr>
              <td><b>Hotel</b></td>
              <td>\t${reservation.hotel}</td>
          </tr>
          <tr>
              <td><b>Tour</b></td>
              <td>\t${reservation.tour}</td>
          </tr>
          <tr>
              <td><b>Date</b></td>
              <td>\t${rsvpDate}</td>
          </tr>
          <tr>
              <td><b>Time</b></td>
              <td>\t${rsvpTime}</td>
          </tr>
          <tr>
              <td><b>Adults</b></td>
              <td>\t${reservation.numAdults}</td>
          </tr>
          ${
            reservation.numKids > 0
              ? `
          <tr>
              <td><b>Kids</b></td>
              <td>\t${reservation.numKids}</td>
          </tr>`
              : ``
          }
          ${
            reservation.reservedBy
              ? `
          <tr>
              <td><b>ReservedBy</b></td>
              <td>\t${reservation.reservedBy}</td>
          </tr>
          `
              : ``
          }
          ${
            reservation.roomNum
              ? `
          <tr>
              <td><b>Room Num</b></td>
              <td>\t${reservation.roomNum}</td>
          </tr>
          </tr>
`
              : ``
          }
          ${
            reservation.details
              ? `
          <tr>
              <td><b>Details</b></td>
              <td>\t${reservation.details}</td>
          </tr>\n
          `
              : ``
          }
          <tr>
              <td><b>Total</b></td>
              <td>\t$${reservation.totalPrice}</td>
          </tr>
          ${
            reservation.depositPaid
              ? `
          <tr>
              <td><b>Deposit</b></td>
              <td>\t${`-${reservation.depositAmount}`}</td>
          </tr>
          `
              : ``
          }
          ${
            reservation.depositPaid
              ? `
          <tr>
              <td><b>Balance</b></td>
              <td>\t$${reservation.balance}</td>
          </tr>
          `
              : ``
          }
        </table>`;

      const eventDescription = html_description.replace(/>\s+</g, "><");

      const newEvent = {
        summary: `${reservation.numAdults + reservation.numKids} ${
          reservation.tour
        } from ${reservation.hotel}`,
        //   conferenceData: {
        //     createRequest: {
        //         requestId: :
        //     }
        //   }
        extendedProperties: {
          private: {
            Hotel: "StayBridge",
            Tour: "Key West",
          },
          shared: {
            Hotel: "StayBridge",
            Tour: "Key West",
          },
        },
        // location: "800 Howard St., San Francisco, CA 94103",
        description: eventDescription,
        start: {
          dateTime: joinDateTimes(reservation.rsvpDate, reservation.rsvpTime),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: addOneHour(
            joinDateTimes(reservation.rsvpDate, reservation.rsvpTime)
          ),
          timeZone: "America/New_York",
        },
        // attachments: [
        //   {
        //     fileUrl:
        //       "https://www.miamifantastictours.com/_next/image?url=%2Fimages%2Ffantastic-logo-2.png",
        //     iconLink:
        //       "https://cdn-icons-png.flaticon.com/512/1055/1055804.png",
        //   },
        // ],
        //   recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
        //   attendees: [
        //     { email: "lpage@example.com" },
        //     { email: "sbrin@example.com" },
        //   ],
        // reminders: {
        //   useDefault: false,
        //   overrides: [
        //     { method: "email", minutes: 24 * 60 },
        //     { method: "popup", minutes: 10 },
        //   ],
        // },
      };

      let gapiResponse = await calendar.events.insert(
        {
          auth: auth,
          calendarId: calendarId,
          supportsAttachments: true,
          requestBody: newEvent,
        }
        //   function (err, event) {
        //     if (err) {
        //       console.log(
        //         "There was an error contacting the Calendar service: " + err
        //       );
        //       return;
        //     }
        //     console.log("Event created: %s", event?.htmlLink);
        //   }
      );

      if (
        gapiResponse["status"] == 200 &&
        gapiResponse["statusText"] === "OK"
      ) {
        // console.log("gAPI Response: ", gapiResponse);
        return res.status(200).json(gapiResponse);
      } else {
        // console.log("CALENDAR EVENT SET");
        return res.status(500).json({ error: gapiResponse });
      }
    } catch (error: any) {
      // console.log(`Error at insertEvent --> ${error}`);
      return res.status(500).json({ error: error });
    }
  };

  insertEvent()
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      // console.log(err);
    });

  // // Event for Google Calendar
  // let event = {
  //     'summary': `This is the summary.`,
  //     'description': `This is the description.`,
  //     'start': {
  //         'dateTime': dateTime['start'],
  //         'timeZone': 'Asia/Kolkata'
  //     },
  //     'end': {
  //         'dateTime': dateTime['end'],
  //         'timeZone': 'Asia/Kolkata'
  //     }
  // };

  // Get all the events between two dates
  const getEvents = async (dateTimeStart: any, dateTimeEnd: any) => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: dateTimeStart,
        timeMax: dateTimeEnd,
        timeZone: "Asia/Kolkata",
      });

      let items = response["data"]["items"];
      return items;
    } catch (error) {
      // console.log(`Error at getEvents --> ${error}`);
      return 0;
    }
  };

  // let start = '2020-10-03T00:00:00.000Z';
  // let end = '2020-10-04T00:00:00.000Z';

  // getEvents(start, end)
  //     .then((res) => {
  //         console.log(res);
  //     })
  //     .catch((err) => {
  //         console.log(err);
  //     });

  // Delete an event from eventID
  // const deleteEvent = async (eventId) => {
  //   try {
  //     let response = await calendar.events.delete({
  //       auth: auth,
  //       calendarId: calendarId,
  //       eventId: eventId,
  //     });

  //     if (response.data === "") {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   } catch (error) {
  //     console.log(`Error at deleteEvent --> ${error}`);
  //     return 0;
  //   }
  // };

  // let eventId = "hkkdmeseuhhpagc862rfg6nvq4";

  // deleteEvent(eventId)
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
export default addCalendarEvent;
