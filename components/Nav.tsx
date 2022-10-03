import Link from "next/link";
import Select, { components } from "react-select";
// import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// import useSWR from "swr";
// import { fetchData } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAnglesRight,
  faArrowRight,
  faBars,
  faCalendar,
  faCircleQuestion,
  faEnvelope,
  faHandsHelping,
  faInfo,
  faMinus,
  faMinusSquare,
  faPhone,
  faPlus,
  faPlusSquare,
  faQuestion,
  faQuestionCircle,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Nav = (props: any) => {
  // const [session, loading] = useSession();
  //   const { data: session, status } = useSession();
  //   const loading = status === "loading";
  //   const [communities, setCommunities] = useState([]);
  //   const { data: communities, error } = useSWR(
  //     "/api/community/allCommunities",
  //     fetchData
  //   );

  const [mobileWidth, setMobileWidth] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showPhone, setShowPhone] = useState<Boolean>();
  const [showWhatsApp, setShowWhatsApp] = useState<Boolean>();
  const [showEmail, setShowEmail] = useState<Boolean>();
  const [showAngle, setShowAngle] = useState<Boolean>();

  const [showPhoneIcon, setShowPhoneIcon] = useState<Boolean>(true);
  const [showWhatsAppIcon, setShowWhatsAppIcon] = useState<Boolean>(true);
  const [showEmailIcon, setShowEmailIcon] = useState<Boolean>(true);
  // const [showEmailIcon, setShowIconEmail] = useState<Boolean>(true);

  const router = useRouter();

  // below were called community (not data) along with the commented useState()
  //   const convertComs = () => {
  //     if (!communities) {
  //       return <div>ERROR</div>;
  //     }

  //     // react-select requires this structure
  //     try {
  //       const options = communities?.map((com: any) => ({
  //         id: com.id,
  //         value: com.name,
  //         label: com.displayName,
  //         icon: "caret-up-solid.svg",
  //       }));
  //       options?.sort((a: any, b: any) => a.label.localeCompare(b.label));
  //       return options;
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  const showOptionsBar = async (e: any) => {
    props.openSidebar();
    return;
  };

  useEffect(() => {
    if (window.innerWidth <= 400) {
      setMobileWidth(true);
      setShowPhone(false);
      setShowWhatsApp(false);
      setShowEmail(false);
    } else {
      setMobileWidth(false);

      // show All Contact Info, Except WhatsApp & Email
      if (400 < window.innerWidth && window.innerWidth <= 450) {
        setShowPhone(false);
        setShowWhatsApp(false);
        setShowEmail(false);
      }
      // show All Contact Info, Except Email
      else if (450 < window.innerWidth && window.innerWidth <= 500) {
        setShowPhone(true);
        setShowWhatsApp(false);
        setShowEmail(false);
      }
      // show All Contact Info, Except Email
      else if (500 < window.innerWidth && window.innerWidth <= 735) {
        setShowPhone(true);
        setShowWhatsApp(true);
        setShowEmail(false);
      }
      // show All Contact Info
      else if (735 < window.innerWidth) {
        setShowPhone(true);
        setShowWhatsApp(true);
        setShowEmail(true);
      }
    }

    setWindowWidth(window.innerWidth);

    // sets up the eventListener for window resizing
    const updateScreenMobile = () => {
      setMobileWidth(window.innerWidth <= 400);
    };
    window.addEventListener("resize", updateScreenMobile);

    // sets up the eventListener for window resizing
    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenMobile);
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    const responsiveStyling = () => {
      // If special Email is open
      if (!showPhoneIcon && !showWhatsAppIcon && showEmail) {
        if (window.innerWidth <= 368) {
          setShowPhoneIcon(true);
          setShowWhatsAppIcon(true);
          setShowEmail(false);
        } else if (550 < window.innerWidth) {
          setShowPhoneIcon(true);
          setShowWhatsAppIcon(true);
          setShowEmail(false);
        }
      } else {
        // regular hide contact details while shrinking
        if (window.innerWidth <= 400) {
          setMobileWidth(true);

          setShowPhone(false);
          setShowWhatsApp(false);
          setShowEmail(false);
        }
        // regular hide details as it gets smaller ABOVE 400px
        else {
          setMobileWidth(false);

          if (400 < window.innerWidth && window.innerWidth <= 450) {
            // Hide all Contact Details
            setShowPhone(false);
            setShowWhatsApp(false);
            setShowEmail(false);
          }
          // show All Contact Info, Except Email
          else if (450 < window.innerWidth && window.innerWidth <= 500) {
            setShowWhatsApp(false);
            setShowEmail(false);
          }
          // show All Contact Info, Except Email
          else if (500 < window.innerWidth && window.innerWidth <= 735) {
            setShowEmail(false);
          }
          // show All Contact Info
          else if (735 < window.innerWidth) {
            // no nothing
          }
          // }
        }
      }
    };
    window.addEventListener("resize", responsiveStyling);

    return () => {
      window.removeEventListener("resize", responsiveStyling);
    };
  }, [showEmail, showPhoneIcon, showEmailIcon]);

  // const firstUpdate = useRef([true, true, true, true]);

  const handleDisplayEmailMobile = () => {
    // Toggle the Email Envelope when (windowWidth <= 735)
    if (windowWidth <= 735) {
      if (showPhoneIcon || showWhatsAppIcon) {
        setShowPhoneIcon(false);
        setShowPhone(false);
        setShowWhatsAppIcon(false);
        setShowWhatsApp(false);
      }
      if (!showPhoneIcon && !showWhatsAppIcon && showEmail) {
        setShowPhoneIcon(true);
        setShowWhatsAppIcon(true);
      }
    } else {
      // Toggle the Email Envelope when (735 < windowWidth)
      if (showPhoneIcon || showWhatsAppIcon) {
        setShowPhoneIcon(true);
        setShowWhatsAppIcon(true);
        // setShowPhone(false);
        // setShowWhatsApp(false);
      }
      if (!showPhoneIcon && !showWhatsAppIcon && showEmail) {
        setShowPhone(false);
        setShowWhatsApp(false);
        setShowPhoneIcon(true);
        setShowWhatsAppIcon(true);
      }
    }
    setShowEmail(!showEmail);
  };

  return (
    <div className="relative flex flex-row items-center justify-between py-0 bg-zinc-50 border-b-3 border-gray-700 overflow-hidden">
      <div className="flex justify-center items-center border-black">
        <Link href="/" as="/">
          <div
            className={`mr-0 mb-1.5 py-0.5 relative border-indigo-600 h-[52px] w-[78px] ${
              windowWidth <= 400 ? "ml-3.5" : "ml-8"
            }`}
          >
            <Image
              layout="fill"
              priority={true}
              className="border-black cursor-pointer"
              src="/images/fantastic-logo-2.png"
              alt="logo"
            />
          </div>
        </Link>
      </div>

      {/* <Link href="/"> */}
      {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            HealWell
          </a> */}
      {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Healnow
          </a> */}
      {/* <a className="text-gray-700 text-2.2xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Heal Right
          </a> */}
      {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Healgood
          </a> */}
      {/* <a className="text-gray-700 text-2.2xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            HealBright
          </a> */}
      {/* </Link> */}

      <div
        className={`border-gray-600 rounded flex flex-row items-center pt-0.5 ${
          windowWidth <= 550 ? "mr-3" : "mr-5"
        }`}
      >
        {showPhoneIcon && (
          <div className="inline-flex shrink-0 border-black items-center">
            <FontAwesomeIcon
              icon={faPhone}
              onClick={() => {
                if (windowWidth <= 735) {
                  if (showWhatsApp) {
                    setShowWhatsApp(!showWhatsApp);
                  }
                  if (showEmail) {
                    setShowEmail(!showEmail);
                  }
                }
                setShowPhone(!showPhone);
              }}
              // onMouseEnter={() => setShowPhone(true)}
              // onMouseLeave={() => setShowPhone(false)}
              className={`cursor-pointer text-orange-500 rotate-12 rounded-full border-gray-600 p-[0.35rem] hover:scale-[110%] text-[1.15rem] mt-0.5`}
            />

            {showPhone && (
              <div
                onClick={() => {
                  if (mobileWidth) {
                    // TRIGGER PHONE CALL
                  }
                }}
                className={`inline-block mt-1 text-zinc-700 font-[sans-serif] ml-2 mr-0 hover:scale-[103%] cursor-pointer border-black`}
              >
                (305) 432 9793
              </div>
            )}
          </div>
        )}

        {showWhatsAppIcon && (
          <div
            className={`inline-flex shrink-0 border-black items-center ${
              windowWidth <= 850 ? "ml-5" : "ml-10"
            }`}
          >
            <div
              onClick={() => {
                if (windowWidth <= 735) {
                  if (showPhone) {
                    setShowPhone(!showPhone);
                  }
                  if (showEmail) {
                    setShowEmail(!showEmail);
                  }
                }
                setShowWhatsApp(!showWhatsApp);
              }}
              className={`inline-block mt-0.5 relative shrink-0 border-indigo-600 h-[26px] w-[26px]`}
            >
              <Image
                layout="fill"
                priority={true}
                className="border-black cursor-pointer hover:scale-[105%] contrast-[1.4]"
                src="/images/whatsapp-icon.png"
                alt="logo"
              />
            </div>

            {showWhatsApp && (
              <div
                onClick={() => {
                  if (mobileWidth) {
                    // TRIGGER SEND NEW WHATSAPP MESSAGE
                  }
                }}
                className={`text-zinc-700 font-[sans-serif] ml-2 mr-0 mt-1 hover:scale-[103%] cursor-pointer border-black`}
              >
                (786) 486 7475
              </div>
            )}
          </div>
        )}

        {showEmailIcon && (
          <div
            className={`inline-flex shrink-0 border-black items-center ${
              windowWidth <= 850 ? "ml-3.5" : "ml-7"
            }`}
          >
            {showEmail && windowWidth <= 735 && (
              <FontAwesomeIcon
                icon={faAngleRight}
                onClick={() => handleDisplayEmailMobile()}
                className={`cursor-pointer text-orange-500 rounded-full border-gray-600 p-[0.44rem] hover:scale-[110%] text-[1.1rem] mt-0.5`}
              />
            )}
            <FontAwesomeIcon
              icon={faEnvelope}
              onClick={() => handleDisplayEmailMobile()}
              className={`cursor-pointer text-orange-500 rounded-full border-gray-600 p-[0.44rem] hover:scale-[110%] text-[1.2rem] mt-0.5`}
            />

            {showEmail && (
              <div
                onClick={() => {
                  if (mobileWidth) {
                    // TRIGGER NEW EMAIL
                  }
                }}
                className={`border-black text-zinc-700 font-[sans-serif] ml-1.5 mr-3 mt-1 hover:scale-[103%] cursor-pointer`}
              >
                info@miamifantastictours.com
              </div>
            )}
          </div>
        )}
      </div>

      {/* {session?.user?.email && (
        <div className="cursor-pointer font-semibold hidden md:block -mb-1">
          <FontAwesomeIcon
            icon={faUser}
            className={`hidden ${
              session?.user?.email ? "inline-block" : ""
            } cursor-pointer text-gray-600 text-[1.58rem] hover:text-rose-400`}
            onClick={(e) => showOptionsBar(e)}
          />
          <span className="ml-3.5 text-lg+">
            {loading ? "" : session?.user?.name}
          </span>
        </div>
      )} */}

      {/* <div className="border-red-600 h-18 flex justify-between 2xl:ml-24">
        {!props.hideLogin && (
          <div className="hidden w-16 sm:block border-black ml-8 font-bold text-center self-center">
            {!session && (
              <button
                onClick={() => signIn()}
                className="text-lg text-gray-800 hover:text-purple-800 hover:saturate-[2]"
              >
                Login
              </button>
            )}
          </div>
        )}
        <div
          className={`ml-8 mr-7 flex text-gray-700 hover:text-indigo-200 border-black`}
        >
          <FontAwesomeIcon
            icon={faBars}
            className={`cursor-pointer self-center text-gray-800 options-bars hover:text-red-500`}
            onClick={(e) => showOptionsBar(e)}
          />
        </div>
      </div> */}
    </div>
  );
};

export default Nav;
