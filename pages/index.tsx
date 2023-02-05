import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = (props) => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  return (
    <div
      className={`relative mx-auto flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/miami_view.jpg')] ${
        windowWidth < 420
          ? `px-3`
          : 420 <= windowWidth && windowWidth < 500
          ? `px-5`
          : `px-8`
      }`}
    >
      <div className="border-red-600 flex flex-row justify-start">
        <div className="container max-w-[30rem] bg-white mt-10 px-6 rounded-sm+ border border-orange-500 ring-1 ring-orange-500">
          <div className="ml-3 inline-block border border-transparent w-36 h-36 items-center">
            <div className="mx-auto mt-6 w-full relative">
              <Image
                layout="responsive"
                width={"100%"}
                height={"66%"}
                className="cursor-pointer"
                src="/images/fantastic-logo-2.png"
                alt="logo"
              />
            </div>
          </div>
          <div className="text-center font-semibold text-2xl text-zinc-800">
            Reserve a Tour Now!
          </div>
          <div
            className={`ml-6 mr-4 mt-3 text-black text-lg- hyphens-auto`}
            lang="en"
          >
            Fantastic Tours is a Miami-based Tourism Company that's been around
            for 10 years providing packages for the most popular tourist
            activities in South Florida. Call or make a reservation with us
            today!
          </div>
          <div
            className={`${
              windowWidth < 505 ? `mt-5` : `mt-4`
            } shrink-0 flex justify-center items-center`}
          >
            <div className="inline-block rounded-sm+">
              <a href="tel:+1-305-432-9793">
                <div className="bg-white rounded-sm+ pl-2 pr-2.5 py-1 flex items-stretch">
                  <FontAwesomeIcon
                    icon={faPhone}
                    onClick={() => {}}
                    href="tel:+1-305-432-9793"
                    className={`cursor-pointer text-orange-500 rotate-12 rounded-full border-gray-600 text-[1.4rem] hover:scale-[104%]`}
                  ></FontAwesomeIcon>
                  <div
                    onClick={() => {}}
                    className={`inline-block text-lg bg-transparent text-zinc-700 font-[sans-serif] ml-3 mr-1 cursor-pointer`}
                  >
                    (305) 432 9793
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="mx-4 mt-5 pt-0.5 mb-6 border-black flex justify-center">
            <Link href={`/reservations`}>
              <div className="w-full text-center inline-block px-4 py-3 cursor-pointer rounded-sm+ border-gray-400 ring-1 ring-zinc-400 hover:contrast-125 bg-red-400 font-[sans-serif]">
                <div className=" text-white text-lg+">Reserve Now</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
