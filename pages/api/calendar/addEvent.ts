import { google, Auth } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reservation = req.body.reservation;

  // console.log("rservation: ", reservation);

  // Provide the required configuration
  if (process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    const CREDENTIALS = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);
  }
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Google calendar API settings
  const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  if (process.env.GOOGLE_CALENDAR_API_KEY) {
    var auth = new google.auth.JWT({
      email: process.env.GOOGLE_CALENDAR_EMAIL,
      keyId: process.env.GOOGLE_CALENDAR_PRIVATE_KEY_ID,
      key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
      scopes: SCOPES,
    });
  }

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

      let gapiResponse = await calendar.events.insert(
        {
          auth: auth,
          calendarId: calendarId,
          requestBody: {
            summary: "Google Calendar API Working",
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
            location: "800 Howard St., San Francisco, CA 94103",
            description: "Fantastic Tours Event",
            start: {
              dateTime: joinDateTimes(
                reservation.rsvpDate,
                reservation.rsvpTime
              ),
              timeZone: "America/New_York",
            },
            end: {
              dateTime: addOneHour(
                joinDateTimes(reservation.rsvpDate, reservation.rsvpTime)
              ),
              timeZone: "America/New_York",
            },
            //   recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            //   attendees: [
            //     { email: "lpage@example.com" },
            //     { email: "sbrin@example.com" },
            //   ],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          },
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
        console.log("gAPI Response: ", gapiResponse);
        return res.status(200).json(gapiResponse);
      } else {
        console.log("CALENDAR EVENT failed");
        return res.status(501).json({ error: "fail 1" });
      }
    } catch (error: any) {
      console.log(`Error at insertEvent --> ${error}`);
      return res.status(502).json({ error: "fail 2" });
    }
  };

  insertEvent()
    .then((res) => {
      console.log("res: ", res);
    })
    .catch((err) => {
      console.log("err: ", err);
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
export default handler;
