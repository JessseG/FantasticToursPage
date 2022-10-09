import { useRouter } from "next/router";
import prisma from "../../../../db";
import { NextApiRequest, NextApiResponse } from "next";

const confirmReservation = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const code = req.query.reservationCode;

  if (!code) {
    return res.status(401).json({ message: "Cannot Validate User 1" });
  }
  // console.log(new Date().toISOString());

  try {
    const pendReservation = await prisma.pendReservation.findUnique({
      where: { id: String(code) },
    });

    if (pendReservation) {
      const verifiedReservation = await prisma.$transaction([
        prisma.reservation.create({
          data: pendReservation,
        }),
        prisma.pendReservation.delete({
          where: { id: String(code) },
        }),
      ]);
      if (verifiedReservation) {
        // res.status(200).json({ message: "User Validated!" });
        await fetch(`${process.env.NEXTAUTH_URL}/api/calendar/addEvent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reservation: pendReservation }),
        }).then(() => res.redirect("/thank_you"));
        // .then((response) => response.json())
        // .then((data) => {
        //   return data;
        // });
      } else {
        // console.log("e-1");
        res.redirect("/_error");
      }
    } else {
      // res.status(401).json({ message: "Cannot Validate Pending User: does not exist" });
      // console.log("e-2");
      res.redirect("/_error");
    }
  } catch (e) {
    // return res.status(401).json({ message: "Cannot Validate User" });
    // console.log(e);
    // console.log("e-3");
    res.redirect("/_error");
  }
};

export default confirmReservation;
