import React, { useEffect, useState } from "react";
import { Prisma, User } from "@prisma/client";
// import { useSession } from "next-auth/react";
// import useSWR from "swr";
import { fetchData } from "../utils/utils";
import NProgress from "nprogress";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

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
  const [windowWidth, setWindowWidth] = useState(0);
  const [hiddenColumns, setHiddenColumns] = useState({
    showTo: false,
    showFrom: false,
    showEmail: false,
    showCreatedAt: false,
    showUpdatedAt: false,
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  // // If fullCom fails, error comes in
  // const { data: allRsvps, error } = useSWR("/api/reservations/findReservations", fetchData, {
  //   fallbackData: props,
  //   // fallbackData: props.fullCom,
  // });

  useEffect(() => {
    setWindowWidth(window.innerWidth); // set initial windowWidth

    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateScreenWidth);

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

    // console.log(session);

    if (session) {
      getReservations();
    } else {
      router.push("/_error");
    }

    setHiddenColumns((prevState) => {
      return {
        ...prevState,
        showTo: window.innerWidth > 850, // Temp
        showFrom: window.innerWidth > 850, // Temp
        showEmail: window.innerWidth > 850,
        showCreatedAt: window.innerWidth > 1800,
        showUpdatedAt: window.innerWidth > 1800,
      };
    });

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    setHiddenColumns((prevState) => {
      return {
        ...prevState,
        showTo: window.innerWidth > 850,
        showFrom: window.innerWidth > 850,
        showEmail: window.innerWidth > 850,
        showCreatedAt: window.innerWidth > 1800,
        showUpdatedAt: window.innerWidth > 1800,
      };
    });
  }, [windowWidth]);

  // console.log(session);

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

  const headerNames = [
    "Date",
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
    "Reserved",
    "Room #",
    "Details",
    "Deposit",
    "Total",
    "Balance",
    "Created",
    "Updated",
  ];

  const tableHeaders = headerNames.map((header, i) => {
    if (header === "Date") {
      return (
        <th
          key={i}
          className={`table-th rounded-{tl}{0.27rem} text-center text-lg+ py-[18px] text-white p-[8px]`}
        >
          {header}
        </th>
      );
    } else if (header === "From") {
      return (
        <th
          key={i}
          className={`table-th text-center text-lg+ py-[18px] text-white p-[8px] ${
            hiddenColumns.showFrom ? "table-cell" : "hidden"
          }`}
        >
          {header}
        </th>
      );
    } else if (header === "To") {
      return (
        <th
          key={i}
          className={`table-th text-center text-lg+ py-[18px] text-white p-[8px] ${
            hiddenColumns.showTo ? "table-cell" : "hidden"
          }`}
        >
          {header}
        </th>
      );
    } else if (header === "Email") {
      return (
        <th
          key={i}
          className={`table-th text-center text-lg+ py-[18px] text-white p-[8px] ${
            hiddenColumns.showEmail ? "table-cell" : "hidden"
          }`}
        >
          {header}
        </th>
      );
    } else if (header === "Created") {
      return (
        <th
          key={i}
          className={`table-th text-center text-lg+ py-[18px] text-white p-[8px] ${
            hiddenColumns.showCreatedAt ? "table-cell" : "hidden"
          }`}
        >
          {header}
        </th>
      );
    } else if (header === "Updated") {
      return (
        <th
          key={i}
          className={`table-th rounded-{tr}{0.27rem} text-center text-lg+ py-[18px] text-white p-[8px] ${
            hiddenColumns.showUpdatedAt ? "table-cell" : "hidden"
          }`}
        >
          {header}
        </th>
      );
    } else {
      return (
        <th
          key={i}
          className={`table-th text-center py-[12px] text-lg+ text-white p-[8px]`}
        >
          {header}
        </th>
      );
    }
  });

  // console.log(tableHeaders);

  if (reservations) {
    const tableRows = Object.values(reservations).map((value: any, j: any) => {
      return (
        <tr className={`bg-${j % 2 === 0 ? evenRowColor : oddRowColor}`}>
          <td className={`border border-[#ddd] p-[8px]`}>{value.toString()}</td>
        </tr>
      );
    });
  }

  // console.log("windowWidth: ", windowWidth);

  return (
    <div className="mx-auto flex flex-col items-stretch w-full">
      <div className="text-black text-3xl items-stretch font-semibold flex flex-1 justify-center">
        {/* <table className="w-full m-auto border-none p-0 border-spacing-0 border-separate">
          <tbody>
            <tr>
              <td className="text-center pt-[10px] pr-[0px] pb-[20px] pl-[0px] text-[22px] font-has text-[#444444]"></td>
            </tr>
          </tbody>
        </table> */}

        <table className="text-center table-fixed w-[100%] border-none p-0">
          {/* <table className="text-center table-fixed w-[20rem] border-none p-0 border-spacing-20 border-separate"> */}
          <tbody className="">
            <tr className="">
              <td>
                {windowWidth > 400 && (
                  <table className="border-[1.5px] border-black text-center mr-auto ml-auto font-has w-full">
                    <tbody>
                      {/* HEADERS */}
                      <tr className="bg-[#758aff]">{tableHeaders}</tr>
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
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] ${
                              hiddenColumns.showFrom ? "table-cell" : "hidden"
                            }`}
                          >
                            {JSON.stringify(rsvp.transportFrom).replace(
                              /"/g,
                              ""
                            ) === "null"
                              ? ``
                              : JSON.stringify(rsvp.transportFrom).replace(
                                  /"/g,
                                  ""
                                )}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] ${
                              hiddenColumns.showTo ? "table-cell" : "hidden"
                            }`}
                          >
                            {JSON.stringify(rsvp.transportTo).replace(
                              /"/g,
                              ""
                            ) === "null"
                              ? ``
                              : JSON.stringify(rsvp.transportTo).replace(
                                  /"/g,
                                  ""
                                )}
                          </td>
                          <td
                            className="border text-lg font-medium border-[#ddd] p-[8px] max-w-[100px] truncate hover:overflow-visible hover:absolute 
                          hover:bg-white hover:scale-125 hover:text-sm hover:rounded-sm+ whitespace-nowrap hover:max-w-[250px] hover:translate-y-2 hover:ring-1 ring-orange-500"
                          >
                            {JSON.stringify(rsvp.name).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] max-w-[110px] truncate hover:overflow-visible hover:absolute 
                          hover:bg-white hover:scale-125 hover:text-sm hover:rounded-sm+ whitespace-nowrap hover:max-w-[400px] hover:translate-y-2 hover:ring-1 ring-orange-500 ${
                            hiddenColumns.showEmail ? "table-cell" : "hidden"
                          }`}
                          >
                            {JSON.stringify(rsvp.email).replace(/"/g, "")}
                          </td>
                          {/* <div className="flex flex-1 items-stretch border border-black"> */}
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] max-w-[130px] truncate hover:overflow-visible hover:absolute 
                          hover:bg-white hover:scale-125 hover:text-sm hover:rounded-sm+ whitespace-nowrap hover:max-w-[170px] hover:translate-y-2 hover:ring-1 ring-orange-500`}
                          >
                            {JSON.stringify(rsvp.phone).replace(/"/g, "")}
                          </td>
                          {/* </div> */}
                          <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                            {JSON.stringify(rsvp.numAdults).replace(/"/g, "")}
                          </td>
                          <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                            {JSON.stringify(rsvp.numKids).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] max-w-[100px] truncate ${
                              JSON.stringify(rsvp.reservedBy).replace(/"/g, "")
                                ? `hover:overflow-visible hover:absolute mx-auto hover:abs-center
                            hover:bg-white hover:scale-125 hover:text-sm hover:rounded-sm+ hover:max-w-[170px] hover:translate-y-2 hover:ring-1 ring-orange-500`
                                : ``
                            }`}
                          >
                            {JSON.stringify(rsvp.reservedBy).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] max-w-[90px] truncate`}
                          >
                            {JSON.stringify(rsvp.roomNum).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] max-w-[130px] truncate ${
                              JSON.stringify(rsvp.details).replace(/"/g, "")
                                ? `hover:overflow-visible hover:absolute mx-auto hover:abs-center hover:whitespace-pre-wrap
                            hover:bg-white hover:scale-125 hover:text-sm hover:rounded-sm+ hover:max-w-[170px] hover:translate-y-2 hover:ring-1 ring-orange-500`
                                : ``
                            }`}
                          >
                            {JSON.stringify(rsvp.details).replace(/"/g, "")}
                          </td>
                          <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                            {JSON.stringify(rsvp.depositAmount).replace(
                              /"/g,
                              ""
                            ) === "null"
                              ? ``
                              : JSON.stringify(rsvp.depositAmount).replace(
                                  /"/g,
                                  ""
                                )}
                          </td>
                          <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                            {JSON.stringify(rsvp.totalPrice).replace(
                              /"/g,
                              ""
                            ) === "null"
                              ? ``
                              : JSON.stringify(rsvp.totalPrice).replace(
                                  /"/g,
                                  ""
                                )}
                          </td>
                          <td className="border text-lg font-medium border-[#ddd] p-[8px]">
                            {JSON.stringify(rsvp.balance).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] ${
                              hiddenColumns.showCreatedAt
                                ? "table-cell"
                                : "hidden"
                            }`}
                          >
                            {JSON.stringify(
                              formatDateTime(rsvp.createdAt)
                            ).replace(/"/g, "")}
                          </td>
                          <td
                            className={`border text-lg font-medium border-[#ddd] p-[8px] ${
                              hiddenColumns.showUpdatedAt
                                ? "table-cell"
                                : "hidden"
                            }`}
                          >
                            {JSON.stringify(
                              formatDateTime(rsvp.updatedAt)
                            ).replace(/"/g, "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OTHER OPTIONS */}
      <div className="w-full mt-44 mx-auto container font-medium font-[sans-serif] text-zinc-400 ring-orange-300 justify-start rounded-sm">
        {/* <div className="mt-36 mx-auto container font-medium font-[sans-serif] border-white text-right text-zinc-400 ring-orange-300 justify-end mb-2 rounded-sm"> */}
        {/* <div className="inline-block w-1/2 px-5 py-3 cursor-pointer text-zinc-600 hover:bg-zinc-100 border-zinc-600 rounded-l-sm+ border-r select-none">
          <Link href={`${router.asPath}`}>Modify Rsvp</Link>
        </div> */}
        {session && (
          <div
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-block px-5 py-3 border-red-600 cursor-pointer text-blue-600 rounded-r-sm+ select-none"
          >
            Logout
          </div>
        )}
        {/* <div className="inline-block w-1/2 px-5 py-3 cursor-pointer text-zinc-600 hover:bg-zinc-100 border-gray-300 rounded-r-sm+ select-none"> */}
        <div className="inline-block px-5 py-3 border-red-600 cursor-pointer text-blue-600 rounded-r-sm+ select-none">
          <Link href={`/tours`}>View Tours</Link>
        </div>
      </div>
    </div>
  );
};

export default Reservations_Table;
