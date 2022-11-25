import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = () => {
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
        <div className="container max-w-[30rem] bg-white mt-10 px-6 rounded-sm+ border border-orange-500 ring-2 ring-orange-500">
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
              windowWidth < 505 ? `mt-5` : `mt-3`
            } shrink-0 flex justify-center items-center`}
          >
            <div className="inline-block rounded-sm+ hover:scale-[102%]">
              <a href="tel:+1-305-432-9793">
                <div className="bg-white rounded-sm+ pl-2 pr-2.5 py-1 flex items-stretch">
                  <FontAwesomeIcon
                    icon={faPhone}
                    onClick={() => {}}
                    href="tel:+1-305-432-9793"
                    className={`cursor-pointer text-orange-500 rotate-12 rounded-full border-gray-600 text-[1.4rem]`}
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
          <div className="mx-4 mt-5 mb-5 border-black flex justify-center">
            <Link href={`/reservations`}>
              <div className="w-full text-center inline-block text-white text-lg px-4 py-2.5 cursor-pointer rounded-sm+ border-[0.08rem] border-gray-900 bg-orange-400 hover:text-black font-[sans-serif]">
                <div className="hover:scale-97">Reserve Now</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="flex min-h-screen flex-col items-center justify-center py-2"> */}
      {/* <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and its API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
