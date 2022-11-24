import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import Link from "next/link";

function Tours() {
  const [tours, setTours] = useState([
    {
      name: "City Tour",
      description:
        "In our double decker buses, you’ll enjoy the most important landmarks and attractions in Miami. Hop on Hop off at South Beach, Wynwood, Little Havana and Downtown Miami, with buses running every 30 minutes from each stop. Don’t miss out on the best and most convenient way of seeing what Miami has to offer!",
      photo_url: "big_bus_image.jpg",
      photo_style: "",
      moreInfoLink: "",
    },
    {
      name: "Biscayne Boat Tour",
      description:
        "Enjoy the best sights of Miami on this 90-minute cruise from Biscayne Bay, exploring the islands of the rich and famous, Miami Beach, Downtown and Brickell, followed by free time at Bayside Marketplace.",
      photo_url: "bayride.webp",
      photo_style: "",
      moreInfoLink: "",
    },
    {
      name: "Key West Tour",
      description:
        "Enjoy the view without the hassle of driving with our trip to Key West! This tour combines sun, scenic nature surrounded by the Atlantic Ocean and the Gulf of Mexico while the bus passes over 42 bridges and 32 islands to reach the southernmost point of the US, only 90 miles from Cuba. Once there, enjoy free time to sunbathe, shop, dine and explore the city. A truly unique experience!",
      photo_url: "keywest.jpg",
      photo_style: "",
      moreInfoLink: "",
    },
    {
      name: "Everglades Tour",
      description:
        "Skim along the grassy water of Everglades National Park in this 45 minute airboat ride while listening to fun facts and learning about the area’s subtropical ecosystem from the experienced captain. Look for a variety of wildlife, alligators, fish, turtles and wading birds in their natural habitat, an exciting and unspoiled wilderness. After, enjoy an alligator show and free time to explore the nature trail and other exhibitions.",
      photo_url: "everglades.jpg",
      photo_style: "",
      moreInfoLink: "",
    },
    {
      name: "Combo Bus and Boat",
      description:
        "Get the full city experience combining our 90 minute boat cruise around the houses of the rich and famous with our Big Bus Tour to see the most important landmarks and attractions of Miami as you Hop off in South Beach, Wynwood and Little Havana. Complemented with free time in Bayside Marketplace.",
      photo_url: "bigbus_bayride.png",
      photo_style: "",
      moreInfoLink: "",
    },
    {
      name: "Speed Boat Thriller & Skyview Combo",
      description:
        "Combine our 45 minute speed boat ride around the islands of the rich and famous with our new Skyview Observation Wheel of Miami. Great picture opportunities! Followed by free time in Bayside Marketplace.",
      photo_url: "thriller.jpg",
      photo_style: "",
      moreInfoLink: "",
    },
  ]);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth); // set initial windowWidth

    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  });

  return (
    <div className="flex flex-1">
      {/*  TOUR  */}
      <div className="flex flex-row justify-center w-full flex-wrap py-1 border-red-500 bg-gray-900">
        {tours.map((tour, i) => {
          return (
            <div
              key={i}
              className={`max-h-[47.5rem] inline-flex flex-col bg-[#f7f7f7] border-zinc-50 border-2 container w-full max-w-[35rem] mx-[0.3rem] my-2 pb-7 text-center overflow-hidden text-black`}
              //   className={`inline-flex flex-col basis-[32.6%] bg-gray-800 border-zinc-300 border-2 container w-full mx-[0.3rem] my-2 p-8 text-center overflow-hidden text-black`}
            >
              <div className="relative mx-auto text-center bg-transparent mb-6 w-full overflow-hidden">
                <Image
                  priority
                  layout="responsive"
                  width={"100%"}
                  height={"66%"}
                  className="cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out"
                  src={`/images/${tour.photo_url}`}
                  alt="Home"
                  title=""
                />
              </div>
              <div
                // className="text-2.2xl mt-2 font-[sans-serif] font-bold text-white"
                className="text-2.2xl mt-2 font-[sans-serif] font-bold text-[#8B7878]"
              >
                {tour.name}
              </div>
              <div
                //   className="text-lg- mt-4 font-[sans-serif] text-white"
                className="text-lg- mt-4 font-[sans-serif] mx-8"
              >
                {tour.description}
              </div>
              <div className="">
                <Link href={`${tour.moreInfoLink}`}>
                  <div className="mt-6 inline-block text-base+ px-4 py-2 cursor-pointer rounded-sm+ border-[0.08rem] border-gray-900 bg-zinc-50 hover:bg-orange-400 font-[sans-serif]">
                    See More
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tours;
