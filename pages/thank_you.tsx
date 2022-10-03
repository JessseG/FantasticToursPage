import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ThankYou = () => {
  useEffect(() => {
    const router = useRouter();

    setTimeout(() => {
      router.push("/reservations");
    }, 10000);
  }, []);

  return (
    <div className="mx-auto flex flex-col flex-1 w-full px-7 items-center bg-zinc-200">
      <div className="m-auto max-w-[30rem] container ring-[1.5px] ring-blue-900 rounded-sm+ border-red-700">
        <div className="block mx-auto my-6 min-w-[5px] relative h-[152px] w-[230px]">
          <Image
            priority
            layout="fill"
            className="contrast-200"
            src="/images/fantastic-logo.png"
            alt="Home"
            title="Home"
          />
        </div>
        <div className="mx-10 pt-6 pb-3 ring-blue-400 rounded-sm+">
          <div className="px-4 text-center text-black text-2.7xl font-medium border-l border-r border-white/[0.35]">
            Thank You!
          </div>
          <div className="text-center align-middle">
            <h2 className="text-lg+ font-normal mx-0 px-[0rem] my-3 p-0 flex-shrink">
              We appreciate you reserving with us at Fantastic Tours
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
