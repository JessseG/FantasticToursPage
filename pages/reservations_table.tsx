import React, { useEffect, useState } from "react";
import { Prisma, User } from "@prisma/client";
// import { useSession } from "next-auth/react";
// import useSWR from "swr";
import { fetchData } from "../utils/utils";
import NProgress from "nprogress";

// type AllReservations = Prisma.ReservationGetPayload<{
//   include: {
//     name: true,
//     email: true,
//     hotel: true,
//     tour: true,
//     transportFrom: true,
//     transportTo: true,
//     phone: true,
//     rsvpDate: true,
//     rsvpTime: true,
//     numAdults: true,
//     numKids: true,
//     reservedBy: true,
//     roomNum: true,
//     details: true,
//     depositPaid: true,
//     depositAmount: true,
//     totalPrice: true,
//     balance: true,
//     createdAt: true,
//     updatedAt: true,
//   };
// }>;

// const Reservations_Table = ({ allRsvps: props }: { allRsvps: AllReservations }) => {
const Reservations_Table = () => {
  const [reservations, setReservations] = useState([]);

  // // If fullCom fails, error comes in
  // const { data: allRsvps, error } = useSWR("/api/reservations/findReservations", fetchData, {
  //   fallbackData: props,
  //   // fallbackData: props.fullCom,
  // });

  useEffect(() => {
    // api request
    const getReservations = async () => {
      // console.log("ran");
      const reservationRes = await fetch("/api/reservations/findReservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(null),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          return data;
        });

      setReservations(reservationRes);
    };

    getReservations();
  }, []);

  const formatDate = (date: any) => {
    return new Date(date)?.toLocaleDateString("en-us", {
      // weekday: "long",
      month: "2-digit",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    });
  };

  const formatTime = (time: any) => {
    return new Date(time)?.toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
    });
  };

  const formatDateTime = (time: any) => {
    return new Date(time)?.toLocaleDateString("en-us", {
      month: "2-digit",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
    });
  };

  // After a pending user is created successfully, then do this below
  // if (pendUser) {
  const email_subject = "Reservation Confirmation";

  const oddRowColor = "#f5f5f5";
  const evenRowColor = "white";

  // const reservationsTable = `
  //           <table style="
  //                       width: 100%;
  //                       margin: auto;
  //                       border: none;
  //                       padding: 0;
  //                       border-spacing: 0;
  //                       border-collapse: separate;
  //                     ">
  //             <tbody>
  //               <tr>
  //                 <td style="
  //                             text-align: center;
  //                             padding: 10px 0px 20px 0px;
  //                             font-size: 22px;
  //                             font-family: Helvetica, Arial, sans-serif;
  //                             color: #444444;
  //                           "></td>
  //               </tr>
  //             </tbody>
  //           </table>

  //           <table style="
  //                         text-align: center;
  //                         width: 100%;
  //                         border: none;
  //                         padding: 0;
  //                         border-spacing: 20;
  //                         border-collapse: separate;
  //                       ">
  //             <tbody>
  //               <tr>
  //                 <td style="
  //                             text-align: center;
  //                             padding: 2.5rem 0px 0px 0px;
  //                             font-size: 1.4rem;
  //                             font-family: Helvetica, Arial, sans-serif;
  //                             color: #444444;
  //                           ">
  //                   <strong>Thank you for Reserving with Fantastic Tours!</strong>
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td style="
  //                             text-align: center;
  //                             padding: 10px 0px 10px 0px;
  //                             font-size: 15px;
  //                             font-family: Helvetica, Arial, sans-serif;
  //                             color: #444444;
  //                           ">
  //                   Here are all your reservation details
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <td>
  //                   <table style="
  //                               border: none;
  //                               text-align: center;
  //                               margin-right: auto;
  //                               margin-left: auto;
  //                               font-family: Arial, Helvetica, sans-serif;
  //                               border-collapse: collapse;
  //                               width: 87%;
  //                               max-width: 650px;
  //                             ">
  //                     <tbody>
  //                       <tr style="background-color: #758aff;">
  //                         <th class="table-th" style="
  //                                     border-top-left-radius: 0.27rem;
  //                                     text-align: center;
  //                                     padding-top: 12px;
  //                                     padding-bottom: 12px;
  //                                     color: white;
  //                                     padding: 8px;
  //                                     width: 35%;
  //                                   ">
  //                           Info
  //                         </th>
  //                         <th class="table-th" style="
  //                                     border-top-right-radius: 0.27rem;
  //                                     text-align: center;
  //                                     padding-top: 12px;
  //                                     padding-bottom: 12px;
  //                                     color: white;
  //                                     padding: 8px;
  //                                   ">
  //                           Details
  //                         </th>
  //                       </tr>
  //                       <tr style="
  //                                   background-color: ${
  //                                     rowStyle[0].style.rowColor
  //                                   };
  //                                 ">
  //                         <td style="
  //                                     font-weight: 600;
  //                                     border: 1px solid #ddd;
  //                                     border-left-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           Name
  //                         </td>
  //                         <td style="
  //                                     border: 1px solid #ddd;
  //                                     border-right-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           ${reservation.name}
  //                         </td>
  //                       </tr>
  //                       <tr style="
  //                                   background-color: ${
  //                                     rowStyle[1].style.rowColor
  //                                   };
  //                                 ">
  //                         <td style="
  //                                     font-weight: 600;
  //                                     border: 1px solid #ddd;
  //                                     border-left-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           Hotel
  //                         </td>
  //                         <td style="
  //                                     border: 1px solid #ddd;
  //                                     border-right-width: 1px;
  //                                     padding: 8px;
  //                                     ">
  //                           ${reservation.hotel}
  //                         </td>
  //                       </tr>
  //                       <tr style="
  //                                   background-color: ${
  //                                     rowStyle[2].style.rowColor
  //                                   };
  //                                 ">
  //                         <td style="
  //                                     font-weight: 600;
  //                                     border: 1px solid #ddd;
  //                                     border-left-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           Tour
  //                         </td>
  //                         <td style="
  //                                     border: 1px solid #ddd;
  //                                     border-right-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           ${reservation.tour}
  //                         </td>
  //                       </tr>
  //                       <tr style="
  //                                   background-color: ${
  //                                     rowStyle[3].style.rowColor
  //                                   };
  //                                 ">
  //                         <td style="
  //                                     font-weight: 600;
  //                                     border: 1px solid #ddd;
  //                                     border-left-width: 1px;
  //                                     padding: 8px;
  //                                   ">
  //                           Phone
  //                         </td>
  //                         <td style="
  //                                     border: 1px solid #ddd" ; padding: 8px; border-right-width: 1px;">
  //                           ${reservation.phone}
  //                         </td>
  //                       </tr>
  //                       <tr style="
  //                       background-color: ${rowStyle[4].style.rowColor};
  //                     ">
  //                         <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Date
  //                         </td>
  //                         <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           ${rsvpDate}
  //                         </td>
  //                       </tr>
  //                       <tr style=" background-color: ${
  //                         rowStyle[5].style.rowColor
  //                       }; ">
  //                         <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Time
  //                         </td>
  //                         <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           ${rsvpTime}
  //                         </td>
  //                       </tr>
  //                       <tr style="
  //                       background-color: ${rowStyle[6].style.rowColor};
  //                     ">
  //                         <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Adults
  //                         </td>
  //                         <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px; ">
  //                           ${reservation.numAdults}
  //                         </td>
  //                       </tr>

  //                       ${
  //                         reservation.numKids > 0
  //                           ? `
  //                       <tr style=" background-color: ${rowStyle[7].style.rowColor}; ">
  //                         <td style=" font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Kids
  //                         </td>
  //                         <td style=" border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           ${reservation.numKids}
  //                         </td>
  //                       </tr>
  //                       `
  //                           : ``
  //                       }

  //                       ${
  //                         reservation.reservedBy
  //                           ? `
  //                       <tr style="
  //                         background-color: ${rowStyle[8].style.rowColor};
  //                       ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
  //                         padding: 8px; border-left-width: 1px;">
  //                           ReservedBy
  //                         </td>
  //                         <td
  //                           style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           ${reservation.reservedBy}
  //                         </td>
  //                       </tr>
  //                       `
  //                           : ``
  //                       }
  //                       ${
  //                         reservation.roomNum
  //                           ? `
  //                       <tr style=" background-color: ${rowStyle[9].style.rowColor}; ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
  //                         padding: 8px; border-left-width: 1px;">
  //                           Room Num
  //                         </td>
  //                         <td
  //                           style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           ${reservation.roomNum}
  //                         </td>
  //                       </tr>
  //                       `
  //                           : ``
  //                       }
  //                       ${
  //                         reservation.details
  //                           ? `
  //                         <tr style="
  //                         background-color: ${rowStyle[10].style.rowColor};
  //                         ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
  //                         padding: 8px; border-left-width: 1px;">
  //                         Details
  //                         </td>
  //                         <td
  //                         style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                         ${reservation.details}
  //                         </td>
  //                         </tr>
  //                         `
  //                           : ``
  //                       }
  //                       <tr style=" background-color: ${
  //                         rowStyle[11].style.rowColor
  //                       }; ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd;
  //                         padding: 8px; border-left-width: 1px;">
  //                           Total
  //                         </td>
  //                         <td
  //                           style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           $${reservation.totalPrice}
  //                         </td>
  //                       </tr>

  //                       ${
  //                         reservation.depositPaid
  //                           ? `
  //                       <tr style=" background-color: ${rowStyle[12].style.rowColor}; ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Deposit
  //                         </td>
  //                         <td style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                         ${reservation.depositAmount}
  //                         </td>
  //                       </tr>
  //                       `
  //                           : ``
  //                       }

  //                       ${
  //                         reservation.depositPaid
  //                           ? `
  //                       <tr style=" background-color: ${rowStyle[13].style.rowColor}; ">
  //                         <td style=" border-bottom-left-radius: 0.27rem; font-weight: 600; border: 1px solid #ddd; padding: 8px; border-left-width: 1px;">
  //                           Balance
  //                         </td>
  //                         <td
  //                           style=" border-bottom-right-radius: 0.27rem; border: 1px solid #ddd; padding: 8px; border-right-width: 1px;">
  //                           $${reservation.balance}
  //                         </td>
  //                       </tr>
  //                       `
  //                           : ``
  //                       }

  //                     </tbody>
  //                   </table>
  //                 </td>
  //               </tr>
  //               <tr style=" height: 40px; display: flex; flex-direction: row; padding-top: 1.1rem;">
  //                 <td style=" padding-right: 10px; width: 50%; text-align: right;">
  //                   <a href=" ${
  //                     process.env.NEXTAUTH_URL
  //                   }/api/reservations/activate/${
  //   pendReservation.id
  // }" target="_blank" style="
  //                     text-align: center;
  //                     border-radius: 5px;
  //                     background-color: #f7a116;
  //                     font-size: 14.5px;
  //                     font-family: Helvetica, Arial, sans-serif;
  //                     color: white;
  //                     text-decoration: none;
  //                     padding: 7px 15px;
  //                     border: 1px solid rgb(228, 228, 231);
  //                     display: inline-block;
  //                     font-weight: 600;
  //                   ">
  //                     Modify ${isMobile ? "" : "Reservation"}
  //                   </a>
  //                 </td>

  //                 <td style="padding-left: 10px; width: 50%; text-align: left;">
  //                   <a href="${
  //                     process.env.NEXTAUTH_URL
  //                   }/api/reservations/activate/${
  //   pendReservation.id
  // }" target="_blank" style="
  //                     text-align: center;
  //                     border-radius: 5px;
  //                     background-color: #5f77ff;
  //                     font-size: 14.5px;
  //                     font-family: Helvetica, Arial, sans-serif;
  //                     color: white;
  //                     text-decoration: none;
  //                     padding: 7px 13px;
  //                     border: 1px solid #346df1;
  //                     display: inline-block;
  //                     font-weight: 600;
  //                     ">
  //                     Confirm ${isMobile ? "" : "Reservation"}
  //                   </a>
  //                 </td>
  //               </tr>

  //               <tr>
  //                 <td style="
  //                   text-align: center;
  //                   padding: 15px 0px 5px 0px;
  //                   text-decoration: underline;
  //                   font-size: 12.3px;
  //                   line-height: 17px;
  //                   font-family: Helvetica, Arial, sans-serif;
  //                   color: #444444;
  //                 ">
  //                   If you did not request this email you can safely ignore it.
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>`;

  // const rsvpTable = () => {

  //   return (

  //   )
  // }

  const headerNames = [
    "Time",
    "Hotel",
    "Tour",
    "From",
    "To",
    "Name",
    "Email",
    "Phone",
    "Adults",
    "Kids",
    "Reserved By",
    "Room #",
    "Details",
    "Dep. Amount",
    "Total Price",
    "Balance",
    "Created",
  ];

  const innerHeaders = headerNames.map((header, i) => {
    return (
      <th
        key={i}
        className="table-th text-center py-[12px] text-lg+ text-white p-[8px]"
      >
        {header}
      </th>
    );
  });

  if (reservations) {
    const tableRows = Object.values(reservations).map((value: any, j: any) => {
      return (
        <tr className={`bg-${j % 2 === 0 ? evenRowColor : oddRowColor}`}>
          <td className="border border-[#ddd] p-[8px]">{value.toString()}</td>
        </tr>
      );
    });
  }

  // console.log(klk);

  return (
    <div>
      <div className="text-black text-3xl font-semibold">
        {/* <table className="w-full m-auto border-none p-0 border-spacing-0 border-separate">
          <tbody>
            <tr>
              <td className="text-center pt-[10px] pr-[0px] pb-[20px] pl-[0px] text-[22px] font-has text-[#444444]"></td>
            </tr>
          </tbody>
        </table> */}

        <table className="text-center w-full border-none p-0 border-spacing-20 border-separate">
          <tbody>
            <tr className="">
              <td>
                <table className="border-[1.5px] border-black text-center mr-auto ml-auto font-has w-[100%]">
                  <tbody>
                    {/* HEADERS */}
                    <tr className="bg-[#758aff]">
                      <th className="table-th rounded-{tl}{0.27rem} text-center text-lg+ py-[12px] text-white p-[8px]">
                        Date
                      </th>
                      {innerHeaders}
                      <th className="table-th rounded-{tr}{0.27rem} text-center text-lg+ py-[12px] text-white p-[8px]">
                        Updated
                      </th>
                    </tr>
                    {/* CELLS */}
                    {reservations.map((rsvp: any, i) => (
                      <tr
                        key={i}
                        className={`bg-${
                          i % 2 === 0 ? evenRowColor : oddRowColor
                        }`}
                      >
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(formatDate(rsvp.rsvpDate)).replace(
                            /"/g,
                            ""
                          )}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(formatTime(rsvp.rsvpTime)).replace(
                            /"/g,
                            ""
                          )}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.hotel).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.tour).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.transportFrom).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.transportTo).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.name).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.email).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.phone).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.numAdults).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.numKids).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.reservedBy).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.roomNum).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.details).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.depositAmount).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.totalPrice).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(rsvp.balance).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(
                            formatDateTime(rsvp.createdAt)
                          ).replace(/"/g, "")}
                        </td>
                        <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                          {JSON.stringify(
                            formatDateTime(rsvp.updatedAt)
                          ).replace(/"/g, "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* 
                <table>
                  <tbody>
                    <tr className="">
                      <th className="table-th rounded-{tl}{0.27rem} text-center text-lg+ py-[12px] text-white p-[8px]">
                        Date
                      </th>
                      {innerHeaders}
                      <th className="table-th rounded-{tr}{0.27rem} text-center text-lg+ py-[12px] text-white p-[8px]">
                        Updated
                      </th>
                    </tr>
                    <tr>
                      <td>A</td>
                      <td>B</td>
                      <td>C</td>
                    </tr>
                  </tbody>
                </table>
                 */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservations_Table;
