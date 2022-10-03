// import Layout from "../components/Layout";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import { Puff, TailSpin } from "react-loader-spinner";
import NProgress from "nprogress";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  CSSProperties,
} from "react";
import { isMobile, isDesktop } from "react-device-detect";
import Select from "react-select";
import Image from "next/image";
// import CalendarContainer from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleQuestion,
  faHandsHelping,
  faInfo,
  faMinus,
  faMinusSquare,
  faPlus,
  faPlusSquare,
  faQuestion,
  faQuestionCircle,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
// import TP, { TimePickerProps } from "react-time-picker/dist/entry.nostyle";
import TextareaAutosize from "react-textarea-autosize";
import { faCalendarTimes } from "@fortawesome/free-regular-svg-icons";
// import { months } from "moment";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { TimePicker } from "antd";
// import "antd/lib/date-picker/style";
// import type { TimePickerProps } from "antd";
import moment, { Moment } from "moment";
import PhoneInput from "react-phone-input-2";
// import Layout from "../components/Layout";
import Link from "next/link";

const Reservations = () => {
  const router = useRouter();
  // const { data: session } = useSession();
  const inputNameElement = useRef<HTMLInputElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const summaryModalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [finalFormSubmitted, setFinalFormSubmitted] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [showTotals, setShowTotals] = useState(false);
  const [applyTransition, setApplyTransition] = useState(false);
  const [worksAtHotel, setWorksAtHotel] = useState(false);
  const [countryCodeEditable, setCountryCodeEditable] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [reservation, setReservation] = useState<any>({
    name: "",
    email: "",
    hotel: null,
    tour: null,
    phone: "",
    numAdults: 0,
    numKids: 0,
    reservedBy: "",
    roomNumber: "",
    details: "",
    depositPaid: false,
    depositAmount: "",
    totalPrice: 0,
    balance: 0,
  });
  const [reservationDate, setReservationDate] = useState<Date | null>(null);
  const [invalidDate, setInvalidDate] = useState(false);
  const [reservationTime, setReservationTime] = useState<moment.Moment | null>(
    null
  );
  const [mobileWidth, setMobileWidth] = useState<any>(null);
  const [slimWidth, setSlimWidth] = useState<any>(null);

  const [nameValidation, setNameValidation] = useState([
    {
      isTouched: false,
    },
    {
      isTouched: false,
    },
  ]);
  const [emailValidation, setEmailValidation] = useState({
    valid: false,
    isTouched: false,
    reservationExists: false,
  });
  const [passwordValidation, setPasswordValidation] = useState([
    {
      passwordMinimum: false,
      message: "Minimum 8 characters",
      isTouched: false,
    },
    {
      passwordsMatch: false,
      message: "Passwords do not match",
      isTouched: false,
    },
  ]);

  useEffect(() => {
    // if (session) {
    //   router.push("/");
    // }

    const mediaQuery2 = window.matchMedia("(max-width: 468px)");
    setSlimWidth(mediaQuery2.matches);

    const matchMediaQuery2 = () => {
      setSlimWidth(mediaQuery2.matches);
    };
    mediaQuery2.addEventListener("change", matchMediaQuery2);

    //_____________________________________________________________

    setWindowWidth(window.innerWidth); // set initial windowWidth

    // sets initial values for states dependant on screen size
    if (window.innerWidth <= 400) {
      setMobileWidth(true);
      document
        .querySelector<HTMLElement>(".react-datepicker")
        ?.style.setProperty("--c", "19rem");
      // document;
      // .querySelector<HTMLElement>(".react-datepicker__current-month")
      // ?.style.setProperty("--c", "1.2rem !important");
    } else if (window.innerWidth > 400) {
      setMobileWidth(false);
      document
        .querySelector<HTMLElement>(".react-datepicker")
        ?.style.setProperty("--c", "100%");
      // document
      //   .querySelector<HTMLElement>(".react-datepicker__current-month")
      //   ?.style.setProperty("--c", "1.44rem !important");
    }

    // sets up the eventListener for window resizing
    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateScreenWidth);

    //_____________________________________________________________

    if (!isMobile && inputNameElement.current) {
      inputNameElement.current.focus();
    }

    return () => {
      // mediaQuery1.removeEventListener("change", matchMediaQuery1);
      mediaQuery2.removeEventListener("change", matchMediaQuery2);
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    const updateScreenHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", updateScreenHeight);
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);

  // console.log(mobileWidth);
  const validateEmail = (email: string) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexp.test(email)) {
      setEmailValidation((state) => ({
        ...state,
        valid: true,
      }));
    } else {
      setEmailValidation((state) => ({
        ...state,
        valid: false,
      }));
    }
  };

  const handleShowTotals = () => {
    setFormSubmitted(true);
    if (
      !reservation.name ||
      /^\s*$/.test(reservation.name) ||
      !reservation.email ||
      /^\s*$/.test(reservation.email) ||
      !emailValidation.valid ||
      reservation.hotel === null ||
      reservation.tour === null ||
      reservation.phone === "" ||
      reservation.phone.length < 10 ||
      reservationDate === null ||
      invalidDate ||
      reservationTime === null ||
      reservation.numAdults === 0
    ) {
      return;
    }
    setShowTotals(true);
  };

  // const handleNewReservation = async (e: React.FormEvent) => {
  const handleNewReservation = async () => {
    // e.preventDefault();
    setFinalFormSubmitted(true);

    // Filter out an empty fields submission.
    if (
      !reservation.name ||
      /^\s*$/.test(reservation.name) ||
      !reservation.email ||
      /^\s*$/.test(reservation.email) ||
      !emailValidation.valid ||
      reservation.hotel === null ||
      reservation.tour === null ||
      reservation.phone === "" ||
      reservation.phone.length < 10 ||
      reservationDate === null ||
      invalidDate ||
      reservationTime === null ||
      reservation.numAdults === 0 ||
      (reservation.depositPaid && reservation.depositAmount === "") ||
      (reservation.depositPaid && parseInt(reservation.depositAmount)! <= 0)
    ) {
      return;
    }

    setShowTotals(false);

    setLoading(true);
    setDisableButton(true);

    type preReservation = {
      name: String;
      email: String;
      hotel: String;
      tour: String;
      phone: String;
      rsvpDate: Date;
      rsvpTime: Date;
      numAdults: Number;
      numKids: Number;
      reservedBy: String;
      roomNum: String;
      details: String;
      depositPaid: Boolean;
      depositAmount: Number;
      totalPrice: Number;
      balance: Number;
    };

    // create new pending User locally
    const preReservation: preReservation = {
      name: reservation.name,
      email: reservation.email.toLowerCase(),
      hotel: reservation.hotel.label,
      tour: reservation.tour.label,
      phone: reservation.phone,
      rsvpDate: reservationDate,
      rsvpTime: reservationTime.toDate(),
      numAdults: reservation.numAdults,
      numKids: reservation.numKids,
      reservedBy: reservation.reservedBy,
      roomNum: reservation.roomNumber,
      details: reservation.details,
      depositPaid: reservation.depositPaid,
      depositAmount: parseInt(reservation.depositAmount),
      totalPrice: reservation.totalPrice,
      balance: reservation.balance,
    };

    // api request
    NProgress.start();
    const reservationResponse = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preReservation: preReservation }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    // checks if reservation was success or failure
    if (reservationResponse) {
      if (reservationResponse.status === "success") {
        // On-Screen Visual respresentation of the reservation (not backend)
        (document.activeElement as HTMLElement).blur();
        setReservation((state: any) => ({
          ...state,
          name: "",
          email: "",
          hotel: null,
          tour: null,
          phone: "",
          numAdults: 0,
          numKids: 0,
          reservedBy: "",
          roomNumber: "",
          details: "",
          depositPaid: false,
          depositAmount: "",
          totalPrice: 0,
          balance: 0,
        }));
        setEmailSent(true);
        setLoading(false);
        setTimeout(async () => {
          router.reload();
        }, 30000);
      } else {
        // console.log("Failed ");
        // Failed reservation

        // Only IF Email is taken
        // if (
        //   reservationResponse.error &&
        //   reservationResponse.error === "Email is taken"
        // ) {
        //   setEmailValidation((state) => ({
        //     ...state,
        //     userExists: true,
        //   }));
        // }
        // if (
        //   reservationResponse.error &&
        //   reservationResponse.error === "Username is taken"
        // ) {
        //   setUserNameTaken(true);
        // }
        setLoading(false);
        setDisableButton(false);
      }
    }

    NProgress.done();

    // router.push(`/communities/${com}`);
  };

  const months = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  const hotels = [
    { label: "none", value: "none" },
    {
      label: "Blue Lagoon",
      options: [
        { label: "Cambria Hotel", value: "Cambria Hotel" },
        { label: "DoubleTree Hotel", value: "DoubleTree Hotel" },
        { label: "Extended Stay Hotel", value: "Extended Stay Hotel" },
        { label: "Hampton Inn", value: "Hampton Inn" },
        { label: "Hyatt House", value: "Hyatt House" },
        { label: "Hilton Hotel", value: "Hilton Hotel" },
        { label: "Homeweood Suiites", value: "Homeweood Suiites" },
        { label: "Pullman Hotel", value: "Pullman Hotel" },
        { label: "Springhill Suites", value: "Springhill Suites" },
      ],
    },
    {
      label: "Doral",
      options: [
        { label: "AC Marriot", value: "AC Marriot" },
        { label: "Aloft Hotel", value: "Aloft Hotel" },
        { label: "Best Western Plus", value: "Best Western Plus" },
        { label: "Baymont Hotel", value: "Baymont Hotel" },
        { label: "Candlewood Hotel", value: "Candlewood Hotel" },
        {
          label: "Courtyard Marriot 105th St",
          value: "Courtyard Marriot 105th St",
        },
        {
          label: "Courtyard Marriot Dolphin",
          value: "Courtyard Marriot Dolphin",
        },
        {
          label: "Courtyard Marriot Dolphin",
          value: "Courtyard Marriot Dolphin",
        },
        { label: "Element Hotel", value: "Element Hotel" },
        { label: "Extended Stay 33rd St", value: "Extended Stay 33rd St" },
        { label: "Fairfield Marriot", value: "Fairfield Marriot" },
        { label: "Hampton Inn 41st St", value: "Hampton Inn 41st St" },
        {
          label: "Hampton Inn Airport West",
          value: "Hampton Inn Airport West",
        },
        {
          label: "Hilton Garden Inn Dolphin",
          value: "Hilton Garden Inn Dolphin",
        },
        {
          label: "Holiday Inn International Mall",
          value: "Holiday Inn International Mall",
        },
        { label: "Holiday Inn 84th Ave", value: "Holiday Inn 84th Ave" },
        { label: "Holiday Inn 87th Ave", value: "Holiday Inn 87th Ave" },
        { label: "Homewood Suites Dolphin", value: "Homewood Suites Dolphin" },
        { label: "Hyatt Place", value: "Hyatt Place" },
        { label: "Intercontinental Hotel", value: "Intercontinental Hotel" },
        { label: "Nuvo Suites", value: "Nuvo Suites" },
        {
          label: "Vacation Village Marriot",
          value: "Vacation Village Marriot",
        },
        { label: "Quality Inn", value: "Quality Inn" },
        {
          label: "Residence Inn Marriot 105th St",
          value: "Residence Inn Marriot 105th St",
        },
        {
          label: "Residence Inn Marriot 19th St",
          value: "Residence Inn Marriot 19th St",
        },
        {
          label: "Residence Inn Marriot 91st Ave",
          value: "Residence Inn Marriot 91st Ave",
        },
        {
          label: "Springhill Suites Marriot",
          value: "Springhill Suites Marriot",
        },
        { label: "Staybridge Suites", value: "Staybridge Suites" },
        {
          label: "TownePlace Suites Marriot",
          value: "TownePlace Suites Marriot",
        },
        { label: "Trump Hotel", value: "Trump Hotel" },
        { label: "Vacation Village", value: "Vacation Village" },
        { label: "Wingate", value: "Wingate" },
      ],
    },
    {
      label: "Miami Airport",
      options: [
        { label: "Best Western Premiere", value: "Best Western Premiere" },
        { label: "Courtyard Marriot", value: "Courtyard Marriot" },
        { label: "Element Hotel", value: "Element Hotel" },
        { label: "Embassy Hotel", value: "Embassy Hotel" },
        { label: "Even Hotel", value: "Even Hotel" },
        { label: "Fairfield Inn Marriot", value: "Fairfield Inn Marriot" },
        { label: "Hampton East", value: "Hampton East" },
        { label: "Holiday Inn 26st", value: "Holiday Inn 26st" },
        { label: "Holiday Inn Ponciana", value: "Holiday Inn Ponciana" },
        { label: "Hyatt Place", value: "Hyatt Place" },
        { label: "Marriot", value: "Marriot" },
        { label: "La Quinta Inn East", value: "La Quinta Inn East" },
        { label: "Red Radisson", value: "Red Radisson" },
        { label: "Red Roof", value: "Red Roof" },
        { label: "Regency", value: "Regency" },
        { label: "Residence Inn Marriot", value: "Residence Inn Marriot" },
        { label: "Staybridge", value: "Staybridge" },
        { label: "Sonesta Plaza", value: "Sonesta Plaza" },
        {
          label: "TownePlace Suites Marriot",
          value: "TownePlace Suites Marriot",
        },
      ],
    },
    {
      label: "Miami Airport North",
      options: [
        { label: "Aloft Hotel", value: "Aloft Hotel" },
        { label: "Best Western Plus", value: "Best Western Plus" },
        { label: "Candlewood", value: "Candlewood" },
        { label: "Clarion", value: "Clarion" },
        {
          label: "Comfort Inn 665 Mokena Dr",
          value: "Comfort Inn 665 Mokena Dr",
        },
        {
          label: "Comfort Inn 657 Minola Dr",
          value: "Comfort Inn 657 Minola Dr",
        },
        { label: "EB Hotel", value: "EB Hotel" },
        { label: "Four Point Sheraton", value: "Four Point Sheraton" },
        { label: "Hilton Garden Inn", value: "Hilton Garden Inn" },
        { label: "Homewood Suites", value: "Homewood Suites" },
        { label: "Onyx Hotel", value: "Onyx Hotel" },
        { label: "La Quinta Inn North", value: "La Quinta Inn North" },
        { label: "Ramada Hotel", value: "Ramada Hotel" },
        { label: "Runaway Inn", value: "Runaway Inn" },
        { label: "Sleep Inn", value: "Sleep Inn" },
      ],
    },
  ];

  const tours = [
    { name: "Big Bus Tour", adultPrice: 80, kidPrice: 80 },
    { name: "Key West", adultPrice: 80, kidPrice: 80 },
    { name: "Everglades", adultPrice: 80, kidPrice: 80 },
    { name: "Boat Tour", adultPrice: 80, kidPrice: 80 },
    { name: "Zoo Miami", adultPrice: 80, kidPrice: 80 },
    { name: "Big Bus + Boat", adultPrice: 95, kidPrice: 95 },
    { name: "Private Tour", adultPrice: null, kidPrice: null },
    { name: "Custom Transport", adultPrice: null, kidPrice: null },
  ];

  // const mappedHotels = () => {
  //   const options = hotels.map((hotel, i) => ({
  //     id: i,
  //     label: month.name,
  //     value: i + 1,
  //   }));
  //   return options;
  // };

  const mappedTours = () => {
    const options = tours.map((month, i) => ({
      id: i,
      label: month.name,
      value: i + 1,
    }));
    return options;
  };

  const validateUserAge13 = (year: any, month: any, day: any) => {
    // find the date 13 years ago
    const dateOfBirth = new Date(`${year}-${month.value}-${day}`);
    const date13YrsAgo = new Date();
    date13YrsAgo.setFullYear(date13YrsAgo.getFullYear() - 13);
    // check if the date of birth is before or on that date
    return dateOfBirth <= date13YrsAgo;
  };

  type Props = {
    value: string;
    onClick: () => void;
    onChange: () => void;
  };

  type RefType = number;

  const datePickingElement = useRef();

  const CustomDateInput = forwardRef<RefType, Props>(
    ({ value, onClick, onChange }, ref) => (
      <div
        onClick={onClick}
        className={`flex flex-row items-center cursor-pointer select-none ${
          formSubmitted && reservationDate === null ? "" : ""
        }`}
      >
        <input
          className={`outline-none border-red-500 container placeholder:text-base+ text-gray-700 text-[0.975rem] caret-transparent cursor-pointer select-none ${
            formSubmitted && reservationDate === null
              ? "placeholder-[#ff0000]"
              : "placeholder-gray-400"
          }`}
          placeholder="Select Date"
          onChange={onChange}
          value={value}
          readOnly
        />
        <div className="mx-auto inline-block ml-[4px] min-w-[5px] relative h-5 w-5">
          <Image
            priority
            layout="fill"
            className="contrast-200 opacity-[60%]"
            src="/images/calendar_icon.svg"
            alt="Home"
            title="Home"
          />
        </div>
      </div>
    )
  );

  // Sets TimePicker Input CSS Styles Dynamically
  if (formSubmitted && reservationTime === null) {
    document
      .querySelector<HTMLElement>(".ant-picker-input > input")
      ?.style.setProperty("--c", "#ff0000"); // css red
  }

  const getTourPrice = (tourName: String) => {
    const tourPrice = tours.filter((tour) => {
      if (tour.name === tourName) {
        return tour;
      }
    });
    return tourPrice[0];
  };

  const checkDisableConfirmBtn = () => {
    if (
      getTourPrice(reservation.tour?.label)?.adultPrice! *
        reservation.numAdults +
        reservation.numKids * getTourPrice(reservation.tour?.label)?.kidPrice! -
        (reservation.depositAmount ? reservation.depositAmount : 0) >
      0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleClickOutside = (ref: any) => {
    const clickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setApplyTransition(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", clickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", clickOutside);
    };
  };

  const validateDate = () => {
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);

    if (reservationDate! < todaysDate) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
    }
  };

  // const firstUpdate = useRef([true, true, true, true, true, true]);

  useEffect(() => {
    // if (firstUpdate.current[0]) {
    //   firstUpdate.current[0] = false;
    //   return;
    // }
    if (windowWidth <= 400) {
      setMobileWidth(true);
      document
        .querySelector<HTMLElement>(".react-datepicker")
        ?.style.setProperty("--c", "19rem");
      // document
      //   .querySelector<HTMLElement>(".react-datepicker__current-month")
      //   ?.style.setProperty("--c", "1.2rem !important");
    } else if (windowWidth > 400) {
      setMobileWidth(false);
      document
        .querySelector<HTMLElement>(".react-datepicker")
        ?.style.setProperty("--c", "100%");
      // document
      //   .querySelector<HTMLElement>(".react-datepicker__current-month")
      //   ?.style.setProperty("--c", "1.44rem !important");
    }
  }, [windowWidth]);

  useEffect(() => {
    // if (firstUpdate.current[1]) {
    //   firstUpdate.current[1] = false;
    //   return;
    // }
    if (showTotals) {
      handleClickOutside(summaryModalRef);
      setApplyTransition(true);
    } else if (!showTotals) {
      setApplyTransition(false);
    }
  }, [showTotals]);

  useEffect(() => {
    // if (firstUpdate.current[2]) {
    //   firstUpdate.current[2] = false;
    //   return;
    // }
    if (applyTransition) {
      setShowTotals(true);
    } else if (!applyTransition) {
      setTimeout(async () => {
        setShowTotals(false);
      }, 300);
    }
  }, [applyTransition]);

  useEffect(() => {
    // if (firstUpdate.current[3]) {
    //   firstUpdate.current[3] = false;
    //   return;
    // }
    const price =
      getTourPrice(reservation.tour?.label)?.adultPrice! *
        reservation.numAdults +
      reservation.numKids * getTourPrice(reservation.tour?.label)?.kidPrice!;

    setReservation((state: any) => ({
      ...state,
      totalPrice: price,
    }));
  }, [reservation.tour?.label, reservation.numAdults, reservation.numKids]);

  useEffect(() => {
    // if (firstUpdate.current[4]) {
    //   firstUpdate.current[4] = false;
    //   return;
    // }
    const balance =
      getTourPrice(reservation.tour?.label)?.adultPrice! *
        reservation.numAdults +
      reservation.numKids * getTourPrice(reservation.tour?.label)?.kidPrice! -
      (reservation.depositAmount ? reservation.depositAmount : 0);
    setReservation((state: any) => ({
      ...state,
      balance: balance,
    }));
  }, [
    reservation.tour?.label,
    reservation.numAdults,
    reservation.numKids,
    reservation.depositAmount,
  ]);

  useEffect(() => {
    // if (firstUpdate.current[5]) {
    //   firstUpdate.current[5] = false;
    //   return;
    // }
    validateDate();
  }, [reservationDate]);

  return (
    // <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/nighttime-miami.webp')]">
    // <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/sunset-palms.jpg')]">
    // <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/south-beach-overview.jpeg')]">
    // <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/palms.jpg')]">
    <div
      className={`relative mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/palms-5.jpg')]`}
    >
      <div
        className={`mx-auto my-auto container flex ${
          emailSent && formSubmitted && mobileWidth
            ? "items-center"
            : "flex-col"
        } flex-1`}
      >
        <form
          onSubmit={handleNewReservation}
          className={`mx-auto mt-7 pt-9 pb-6 mb-[4.4rem] relative container self-center w-full rounded-md text-base+ ${
            emailSent && formSubmitted && mobileWidth
              ? "max-w-[30rem] mt-0 bg-white ring-2 ring-indigo-300 border-indigo-300 border-[0.04rem]"
              : emailSent && formSubmitted
              ? "max-w-[30rem] mt-32 bg-white ring-2 ring-indigo-300 border-indigo-300 border-[0.07rem]"
              : "max-w-[40rem] border-gray-400"
          }`}
        >
          {loading && (
            <div className="absolute flex justify-center items-center h-full w-full -translate-y-28 rounded-md opacity-[100] z-10">
              <TailSpin color="rgb(92, 145, 199)" height={85} width={85} />
            </div>
          )}

          {!emailSent && !showTotals && (
            <div
              className={`mx-0 xs:mx-11 sm:mx-14 ${
                loading ? "opacity-[70%]" : ""
              }`}
            >
              {/* TITLE */}
              <div className="font-bold font-[sans-serif] text-white text-center">
                <div className="w-fit px-1 backdrop-blur-[1px] text-[36px] tracking-tight rounded-md pt-1 mx-auto">
                  FANTASTIC TOURS
                </div>
                <div className="w-fit px-1 -mt-1 pt-1 backdrop-blur-[1px] text-[20px] tracking-tight rounded-b-md mx-auto">
                  RESERVATIONS
                  {/* {windowWidth} */}
                </div>
              </div>

              {/* NAME */}
              <div className="mt-9">
                {/*  New Reservation Name */}
                <input
                  ref={inputNameElement}
                  type="text"
                  placeholder="Full Name"
                  value={reservation.name}
                  onChange={(e) => {
                    if (/^[a-zA-Z\s'.-]*$/.test(e.target.value)) {
                      const newValidation = [...nameValidation];
                      newValidation[0].isTouched = true;
                      setNameValidation(newValidation);
                      setReservation((state: any) => ({
                        ...state,
                        name: e.target.value,
                      }));
                    } else {
                      e.preventDefault();
                    }
                  }}
                  className={`mx-auto px-3 py-2 w-full placeholder-gray-400 text-gray-600 relative ring-2 bg-white rounded-sm
                      border-0 shadow-md outline-none focus:outline-none ${
                        formSubmitted &&
                        (!reservation.name || /^\s*$/.test(reservation.name))
                          ? "ring-orange-300 placeholder-[#ff0000]"
                          : "ring-orange-300 placeholder-gray-400"
                      }`}
                />
                {/* {formSubmitted &&
                  (!reservation.name || /^\s*$/.test(reservation.name)) && (
                    <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                      Name Required
                    </div>
                  )} */}
              </div>

              {/* EMAIL */}
              <div className="mt-7 w-[99.1%] xs:w-full">
                <input
                  type="text"
                  placeholder="Email"
                  value={reservation.email}
                  onChange={(e) => {
                    if (/\s/g.test(e.target.value)) {
                      e.preventDefault();
                    } else {
                      validateEmail(e.target.value);
                      setEmailValidation((state) => ({
                        ...state,
                        userExists: false,
                        isTouched: true,
                      }));
                      setReservation((state: any) => ({
                        ...state,
                        email: e.target.value,
                      }));
                    }
                  }}
                  className={`mx-auto px-3 py-2 w-full ${
                    formSubmitted && !emailValidation.valid
                      ? "text-[#dd0000]"
                      : "text-gray-600"
                  } relative ring-2
                    bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none
                    ${
                      formSubmitted &&
                      (!emailValidation.valid ||
                        emailValidation.reservationExists)
                        ? "ring-orange-300 placeholder-[#ff0000]"
                        : "ring-orange-300 placeholder-gray-400"
                    }`}
                />
                {/* {formSubmitted &&
                  (!emailValidation.valid ||
                    emailValidation.reservationExists) && (
                    <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                      Invalid email
                    </div>
                  )} */}
              </div>

              {/* HOTEL */}
              <div className="mx-auto mt-7 w-[97%] xs:w-23/24">
                <Select
                  placeholder="Hotel"
                  className={`px-3 flex flex-row relative bg-white
                    rounded-sm border-0 ring-2 shadow-md outline-none ${
                      formSubmitted && reservation.hotel === null
                        ? "ring-orange-300"
                        : "ring-orange-300"
                    }`}
                  // tabSelectsValue={false}
                  options={hotels}
                  value={reservation.hotel}
                  instanceId="select-reservation-hotel"
                  // isClearable={true}
                  onChange={(option) => {
                    setReservation((state: any) => ({
                      ...state,
                      hotel: option,
                    }));
                  }}
                  styles={{
                    control: (base) => ({
                      // outermost container
                      ...base,
                      fontSize: "1.06rem",
                      background: "white",
                      borderRadius: "3px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "none",
                      // padding: "0",
                      // margin: "auto",
                      // border: "1px solid red",
                      width: "100%",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0",
                      background: "transparent",
                      outline: "none",
                      border: "none",
                      margin: "0",
                      // border: "1px solid red",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      background: "transparent",
                      color: "rgb(75, 85, 99)",
                      width: "100%",
                    }),
                    input: (base) => ({
                      ...base,
                      // color: "none",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color:
                        formSubmitted && reservation.hotel === null
                          ? "#ff0000" // css red
                          : "rgb(156 163 175)",
                    }),
                    menu: (base) => ({
                      ...base,
                      // padding: "0rem 1rem 0 1rem",
                      // backgroundColor: "red",
                      width: "94.5%",
                    }),
                    menuList: (base) => ({
                      ...base,
                      // padding: "0 1rem 0 0",
                      width: "full",
                      border: "1px solid gray",
                      "::-webkit-scrollbar": {
                        width: "0px",
                        height: "0px",
                      },
                      "::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                      },
                      "::-webkit-scrollbar-thumb": {
                        background: "#888",
                      },
                      "::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                      },
                    }),
                    option: (
                      base,
                      { data, isDisabled, isFocused, isSelected }
                    ) => ({
                      ...base,
                      color: "black",
                      fontSize: "1rem",
                      padding: "0rem 1rem 0 1rem",
                      width: "full",
                      cursor: "pointer",
                      // backgroundColor: isSelected ? "rgb(220, 220, 220)" : "default",
                      // ":hover": {
                      //   backgroundColor: "rgb(220, 220, 220)",
                      // },
                      // backgroundColor: isFocused
                      //   ? "rgb(220, 220, 220)"
                      //   : "white",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      background: "transparent",
                      padding: "0 0 0 0",
                      margin: "0",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: 0,
                      alignSelf: "center",
                      color: "gray",
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      padding: "0",
                      marginRight: "0.4rem",
                      backgroundColor: "transparent",
                      margin: "0",
                      // border: "1px solid red",
                    }),
                    groupHeading: (base) => ({
                      ...base,
                      color: "#FBA500",
                      // fontWeight: "700",
                      // border: "1px solid red",
                    }),
                  }}
                />

                {/* {formSubmitted && reservation.hotel === null && (
                  <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                    Selection Required
                  </div>
                )} */}
              </div>

              {/* TOUR */}
              <div className="mt-7 mx-auto w-[95%] xs:w-23/24">
                <Select
                  placeholder="Tour"
                  className={`px-3 flex flex-row relative bg-white 
                    rounded-sm border-0 ring-2 shadow-md outline-none ${
                      formSubmitted && reservation.tour === null
                        ? "ring-orange-300"
                        : "ring-orange-300"
                    }`}
                  // tabSelectsValue={false}
                  options={mappedTours()}
                  value={reservation.tour}
                  instanceId="select-reservation-tour"
                  // isClearable={true}
                  onChange={(option) => {
                    setReservation((state: any) => ({
                      ...state,
                      tour: option,
                    }));
                  }}
                  styles={{
                    control: (base) => ({
                      // outermost container
                      ...base,
                      fontSize: "1.06rem",
                      background: "white",
                      borderRadius: "3px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "none",
                      // padding: "0",
                      // margin: "auto",
                      // border: "1px solid red",
                      width: "100%",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0",
                      background: "transparent",
                      outline: "none",
                      border: "none",
                      margin: "0",
                      // border: "1px solid red",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      background: "transparent",
                      color: "rgb(75, 85, 99)",
                      width: "100%",
                    }),
                    input: (base) => ({
                      ...base,
                      // color: "none",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color:
                        formSubmitted && reservation.tour === null
                          ? "#ff0000" // css red
                          : "rgb(156 163 175)",
                    }),
                    menu: (base) => ({
                      ...base,
                      // padding: "0rem 1rem 0 1rem",
                      // backgroundColor: "red",
                      width: "94.5%",
                    }),
                    menuList: (base) => ({
                      ...base,
                      // padding: "0 1rem 0 0",
                      width: "full",
                      border: "1px solid gray",
                      "::-webkit-scrollbar": {
                        width: "0px",
                        height: "0px",
                      },
                      "::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                      },
                      "::-webkit-scrollbar-thumb": {
                        background: "#888",
                      },
                      "::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                      },
                    }),
                    option: (
                      base,
                      { data, isDisabled, isFocused, isSelected }
                    ) => ({
                      ...base,
                      color: "black",
                      fontSize: "1rem",
                      padding: "0rem 1rem 0 1rem",
                      width: "full",
                      cursor: "pointer",
                      // backgroundColor: isSelected ? "rgb(220, 220, 220)" : "default",
                      // ":hover": {
                      //   backgroundColor: "rgb(220, 220, 220)",
                      // },
                      // backgroundColor: isFocused
                      //   ? "rgb(220, 220, 220)"
                      //   : "white",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      background: "transparent",
                      padding: "0 0 0 0",
                      margin: "0",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: 0,
                      alignSelf: "center",
                      color: "gray",
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      padding: "0",
                      marginRight: "0.4rem",
                      backgroundColor: "transparent",
                      margin: "0",
                      // border: "1px solid red",
                    }),
                  }}
                />

                {/* {(userNameTaken && (
                  <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                    Username is taken
                  </div>
                )) ||
                  (formSubmitted && reservation.tour === null && (
                    <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                      Selection Required
                    </div>
                  ))} */}
              </div>

              {/* PHONE */}
              <div className="mt-7 mx-auto w-[92.5%] xs:w-21/24">
                <PhoneInput
                  country={"us"}
                  value={reservation.phone}
                  onFocus={() => {
                    setCountryCodeEditable(true);
                    // console.log("focused");
                  }}
                  onChange={(
                    phone,
                    data: { dialCode: any },
                    event,
                    formattedValue
                  ) => {
                    setReservation((state: any) => ({
                      ...state,
                      phone: formattedValue,
                    }));

                    // handlePhoneInput(phone);
                  }}
                  placeholder="Phone Number"
                  inputStyle={{
                    // backgroundColor: "black",
                    width: "100%",
                    border: "none",
                    display: "flex",
                    fontSize: "1.03rem",
                    color: "rgb(75, 85, 99)",
                  }}
                  // containerStyle={{
                  //   display: "block",
                  //   alignItems: "center",
                  // }}
                  // autoFormat={false}
                  // searchClass="bg-black"
                  // enableSearch={true}
                  // disableSearchIcon={true}
                  // countryCodeEditable={countryCodeEditable}
                  buttonClass="h-full self-center"
                  disableCountryCode={!countryCodeEditable}
                  inputClass={`text-bg container w-full flex items-center inline-block placeholder:text-base pt-[0.15rem] ${
                    formSubmitted && reservation.phone.length < 10
                      ? "placeholder:text-[#ff0000]"
                      : "placeholder:text-gray-400"
                  }`}
                  containerClass={`mx-auto pr-2 py-0.5 container w-full flex text-black relative ring-2 
                      bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none
                    ${
                      formSubmitted && reservation.phone.length < 10
                        ? "ring-orange-300"
                        : "ring-orange-300"
                    }`}
                />
                {/* {formSubmitted && reservation.phone.length < 10 && (
                  <div className="table -mb-6 px-3 py-1 text-white text-sm rounded-b-md backdrop-blur-lg">
                    Phone Required
                  </div>
                )} */}
              </div>

              {/* CHECKBOX */}
              {/* <div className="mt-7">
                <div className="px-4 mx-auto w-[89%] xs:w-[73%] container flex items-center text-center py-[0.48rem] rounded-sm+ bg-white ring-2 ring-orange-300">
                  <input type="checkbox" className="checkbox-1 bg-green-500" />
                  <div className="ml-3 inline-block text-zinc-500 text-base">
                    Do you work for an agency or hotel?
                  </div>
                </div>
              </div> */}

              {/* DATE - TIME */}
              <div className="mt-7">
                <div className="mx-auto w-23/24 xs:w-21/24 flex justify-around xs:justify-evenly">
                  <div
                    className={`container max-w-[43.5%] xs:max-w-[12rem] min-h-[38.17px] flex items-center pl-4 pr-3 ring-2 bg-white rounded-sm+ border-blue-400 ${
                      formSubmitted && invalidDate && reservationDate !== null
                        ? "ring-red-500"
                        : "ring-orange-300"
                    }`}
                  >
                    <DatePicker
                      //   selectsRange={true}
                      //   id="reservation-datepicker"
                      //   className="pl-4 py-1.5 rounded-sm+ inline-block"
                      //   calendarContainer={MyContainer}
                      //   isSecure={true}
                      //   ref={datePickingElement}
                      //   calendarClassName=""
                      //   placeholderText="Select Date"
                      calendarClassName="custom-calendar"
                      disabledKeyboardNavigation={true}
                      selected={reservationDate}
                      onChange={(date: Date) => setReservationDate(date)}
                      customInput={
                        <CustomDateInput
                          ref={datePickingElement.current}
                          value={String(reservationDate)}
                          onClick={() => onclick}
                          onChange={() => onchange}
                        />
                      }
                      // Long Months
                      dateFormat={
                        slimWidth &&
                        (reservationDate?.getMonth() === 0 ||
                          reservationDate?.getMonth() === 1 ||
                          reservationDate?.getMonth() === 8 ||
                          reservationDate?.getMonth() === 10 ||
                          reservationDate?.getMonth() === 11)
                          ? "MMM d, yyyy"
                          : "MMMM d, yyyy"
                      }
                      withPortal
                    />
                  </div>
                  {/* </span> */}
                  {/* <TP
                      onChange={(date: Date) => setReservationTime(date)}
                      className="px-2 border-none outline-none bg-white rounded-sm+ ring-2 ring-orange-300"
                      clockClassName="class1 class2"
                      portalContainer
                    /> */}
                  <TimePicker
                    //   onFocus={(e) => e.preventDefault()}
                    {...TimePicker}
                    allowClear={false}
                    inputReadOnly
                    minuteStep={5}
                    format="h:mm A"
                    use12Hours={true}
                    showSecond={false}
                    ref={timePickerRef}
                    value={reservationTime}
                    placeholder="Select Time"
                    hideDisabledOptions={false}
                    open={timePickerOpen}
                    // onClick={() => {
                    //   if (timePickerOpen) {
                    //     setTimePickerOpen(false);
                    //   } else {
                    //     setTimePickerOpen(true);
                    //     handleClickOutside(timePickerRef);
                    //   }
                    // }}
                    onClick={() => {
                      setTimePickerOpen(true);
                      // handleClickOutside(timePickerRef);
                    }}
                    onOpenChange={() => setTimePickerOpen(false)}
                    // onChange={() => setTimePickerOpen(false)}
                    className={`max-w-[38.5%] xs:max-w-[9.6rem] min-h-[38.17px] flex items-center container ring-2 transition-none bg-white rounded-sm+ outline-none cursor-pointer ${
                      formSubmitted && reservationTime === null
                        ? "placeholder-[#ff0000] ring-orange-300"
                        : "placeholder-gray-400 ring-orange-300"
                    }`}
                    // onChange={(value, dateString: string) => {
                    //   // console.log("Time", dateString);
                    //   setReservationTime(moment(dateString, "h:mm A"));
                    // }}
                    onSelect={(value) => {
                      // console.log("Time", dateString);
                      setReservationTime(value);
                    }}
                    // popupClassName="ring-2 ring-orange-300"
                    // defaultValue="10:00 AM"
                  />
                  {/* <TimePicker format="HH:mm" /> */}
                  {/* <input
                      type="date"
                      className="px-3 py-1.5 rounded-sm+"
                      placeholder="Select Date"
                    /> */}
                  {/* <input
                      type="time"
                      className="pl-5 pr-4 py-1.5 rounded-sm+"
                      placeholder="Time"
                    /> */}
                </div>
              </div>

              {/* ADULTS - KIDS */}
              <div className="mt-7">
                <div className="mx-auto w-23/24 xs:w-21/24 flex justify-around xs:justify-evenly">
                  <div
                    className={`max-w-[43.5%] xs:max-w-[12rem] bg-white pl-3.5 xs:pl-4 pr-2.5 rounded-sm+ flex justify-between items-center ring-2 overflow-hidden w-min-0 container ${
                      formSubmitted && reservation.numAdults === 0
                        ? "ring-orange-300"
                        : "ring-orange-300"
                    }`}
                  >
                    <div
                      className={`py-2 rounded-sm+ text-[1.03rem] outline-none select-none w-min-0 overflow-hidden ${
                        formSubmitted && reservation.numAdults === 0
                          ? "text-[#ff0000]"
                          : reservation.numAdults > 0
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      Adults
                    </div>
                    <div className="flex justify-between items-center overflow-visible">
                      <FontAwesomeIcon
                        icon={faMinusSquare}
                        onClick={() => {
                          if (reservation.numAdults > 0) {
                            setReservation((state: any) => ({
                              ...state,
                              numAdults: reservation.numAdults - 1,
                            }));
                          }
                        }}
                        className={`pl-1 ${
                          reservation.numAdults >= 10
                            ? "pr-[0.225rem]"
                            : "pr-[0.19rem]"
                        } xs:pr-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                      />
                      <div className="w-5 font-semibold text-gray-500 text-center border-black select-none">
                        {reservation.numAdults}
                      </div>
                      <FontAwesomeIcon
                        icon={faPlusSquare}
                        onClick={() =>
                          setReservation((state: any) => ({
                            ...state,
                            numAdults: reservation.numAdults + 1,
                          }))
                        }
                        className={`pr-0.5 xs:pr-1 ${
                          reservation.numAdults >= 10
                            ? "pl-[0.27rem]"
                            : "pl-[0.11rem]"
                        } xs:pl-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                      />
                    </div>
                  </div>
                  <div className="max-w-[38.5%] xs:max-w-[9.6rem] bg-white pl-[0.94rem] xs:pl-4 pr-2.5 rounded-sm+ flex justify-between items-center ring-2 ring-orange-300 overflow-hidden w-min-0 container">
                    <div
                      className={`py-2 rounded-sm+ text-[1.03rem] outline-none select-none w-min-0 overflow-hidden ${
                        reservation.numKids > 0
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      Kids
                    </div>
                    <div className="flex justify-between items-center overflow-visible">
                      <FontAwesomeIcon
                        icon={faMinusSquare}
                        onClick={() => {
                          if (reservation.numKids > 0) {
                            setReservation((state: any) => ({
                              ...state,
                              numKids: reservation.numKids - 1,
                            }));
                          }
                        }}
                        className={`pl-1 ${
                          reservation.numKids >= 10
                            ? "pr-[0.225rem]"
                            : "pr-[0.19rem]"
                        } xs:pr-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                      />
                      <div className="w-5 font-semibold text-gray-500 text-center border-black select-none">
                        {reservation.numKids}
                      </div>
                      <FontAwesomeIcon
                        icon={faPlusSquare}
                        onClick={() =>
                          setReservation((state: any) => ({
                            ...state,
                            numKids: reservation.numKids + 1,
                          }))
                        }
                        className={`pr-0.5 xs:pr-1 ${
                          reservation.numKids >= 10
                            ? "pl-[0.27rem]"
                            : "pl-[0.11rem]"
                        } xs:pl-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RESERVEDBY - ROOM */}
              <div className="mt-7">
                <div className="mx-auto w-23/24 xs:w-21/24 flex justify-around xs:justify-evenly">
                  <input
                    value={reservation.reservedBy}
                    onChange={(e) =>
                      setReservation((state: any) => ({
                        ...state,
                        reservedBy: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Reserved By"
                    className="max-w-[43.5%] xs:max-w-[12rem] pl-3.5 pr-2 py-[0.46rem] text-base placeholder:text-[1.05rem] text-gray-600 rounded-sm+ ring-2 ring-orange-300 outline-none container"
                  />
                  <input
                    value={reservation.roomNumber}
                    onChange={(e) =>
                      setReservation((state: any) => ({
                        ...state,
                        roomNumber: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Room #"
                    className="max-w-[38.5%] xs:max-w-[9.6rem] pl-3.5 pr-2 py-[0.46rem] text-base placeholder:text-[1.05rem] text-gray-600 rounded-sm+ ring-2 ring-orange-300 outline-none container"
                  />
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-6">
                <div className="mx-auto w-[94.5%] xs:w-11/12 rounded-sm border-blue-300 container border-0 shadow-lg ring-2 ring-orange-300">
                  {/* <div className="mx-auto pl-5 text-left py-[0.437rem] border-b bg-white">
                    <input type="checkbox" />
                    <div className="ml-3 inline-block text-zinc-600">
                      Deposit Paid?
                    </div>
                  </div>
                  <div className="mx-auto pl-5 text-left py-[0.437rem] border-b bg-white">
                    <input type="checkbox" />
                    <div className="ml-3 inline-block text-zinc-600">
                      Do you work for an agency or hotel?
                    </div>
                  </div> */}
                  <TextareaAutosize
                    onFocus={(e) => {
                      var val = e.target.value;
                      e.target.value = "";
                      e.target.value = val;
                    }}
                    minRows={3}
                    className="text-gray-600 block container px-3.5 py-2.5 outline-none no-scroll"
                    placeholder="Details (optional)"
                    value={reservation.details}
                    onChange={(e) =>
                      setReservation((state: any) => ({
                        ...state,
                        details: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* RESERVE BUTTON */}
              <div className="mt-8 w-full border-black">
                <button
                  disabled={disableButton}
                  className="px-3 py-2 border w-full hover:saturate-[3] saturate-[2] text-gray-700 bg-orange-300 text-xl
                    font-semibold border-gray-500 rounded-sm+ outline-none"
                  onClick={() => handleShowTotals()}
                  type="button"
                >
                  Reserve
                </button>
              </div>
            </div>
          )}

          {/* EMAIL SENT MESSAGE */}
          {finalFormSubmitted && emailSent && (
            <div
              className="-mb-1"
              // className="m-auto -translate-y-20 pt-14 pb-7 container self-center w-full bg-white max-w-[30rem] rounded-lg border-[0.09rem] border-indigo-300 saturate-[1.5]"
            >
              <div className="mx-auto bg-indigo-100 rounded-[2rem] mt-8 mb-9 h-44 w-64 relative">
                <Image
                  layout="fill"
                  className="cursor-pointer"
                  src="/images/email-icon-shrunk.png"
                  alt="Home"
                  title="Home"
                />
              </div>
              <h3 className="text-2.7xl mt-5 mb-0 font-semibold text-gray-700 text-center">
                Confirmation Email Sent!
              </h3>
              <div className="container mt-0 mx-auto">
                <div className="mt-5 px-2 py-3 text-center text-black text-sm++ border-[1.3px] border-[#ff0000] leading-6 mx-11 rounded-sm+">
                  <div className="mb-1 font-semibold underline underline-offset-2 text-base text-red-700 tracking-wide">
                    IMPORTANT
                  </div>
                  <span className="font-semibold leading-5">Next step: </span>{" "}
                  <span className=" border-black">
                    Check your email and{" "}
                    <span className="font-semibold text-black tracking-wide">
                      Confirm
                    </span>{" "}
                    your reservation. It is very important that you do so,
                    otherwise the reservation will{" "}
                    <span className="font-semibold">not</span> be registered
                  </span>
                </div>
                <div className="mt-4 text-center text-blue-900 font-semibold text-sm++ leading-6 px-10">
                  <span className="text-lg-">*</span> Reservation Details are
                  included in the Email
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* MODAL */}
      {showTotals && reservation.tour && reservation.numAdults > 0 && (
        <div
          className={`fixed top-0 right-0 bottom-0 left-0 flex flex-col flex-1 w-full z-50 bg-black bg-opacity-75 px-4`}
        >
          <div
            ref={summaryModalRef}
            className={`m-auto container max-w-[30rem] bg-white text-black opacity-100 rounded-sm+ transition ease-in-out duration-500 ${
              applyTransition ? "translate-y-[0vh]" : "translate-y-[-100vh]"
            }`}
          >
            <div
              className={`pb-5 z-50 relative text-black bg-indigo-50 rounded-sm+ ring-2 ring-orange-300 px-7 pt-6`}
            >
              <div className={`mx-auto container max-w-[29rem]`}>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={() => setApplyTransition(false)}
                  className={`absolute xs:mr-1 my-0.5 right-5 top-5 cursor-pointer text-neutral-500 contrast-[2.4] 
                  text-[1.2rem] hover:text-orange-900 rounded-full p-1 w-[1.2rem]`}
                />
                <div className="px-2.5 py-1 text-2.2xl font-semibold">
                  Summary
                </div>
                <hr className="mt-1 border-t-[1.35px] border-zinc-800" />
                {/* TOUR SUMMARY */}
                <div className="mt-0 mx-1.5 border-b-[1.33px] pr-1.5 py-4 border-zinc-700 flex flex-row justify-between">
                  <div className="w-full">
                    <div className="flex flex-row justify-between w-full border-black mr-1 py-2">
                      <span className="font-semibold text-lg h-fit flex items-center rounded-sm+ pl-2">
                        {reservation.tour?.label || "Tour"}
                      </span>
                      <span className="border-black">
                        <span className="w-[22px] inline-flex justify-center items-center ml-0 mr-2 ring-[0.8px] h-[1.6rem] text-center ring-orange-500 border-black rounded-sm bg-white">
                          {reservation.numAdults}
                        </span>
                        <div className="inline-block w-[40px]">
                          {reservation.numAdults > 1 ? "Adults" : "Adult"}
                        </div>
                      </span>
                      <span className="border-black text-right -ml-5">
                        <span className="w-[67px] text-lg- inline-block mr-0 text-right border-black font-semibold">
                          $
                          {reservation.numAdults *
                            getTourPrice(reservation.tour?.label)?.adultPrice!}
                          .00
                        </span>
                      </span>
                    </div>
                    {reservation.numKids > 0 && (
                      <div className="flex flex-row justify-between w-full border-black mr-1 py-2">
                        <span className="font-semibold text-lg text-transparent select-none h-fit flex items-center rounded-sm+ pl-2">
                          {reservation.tour?.label || "Tour"}
                        </span>
                        <span className="border-black">
                          <span className="w-[22px] inline-flex justify-center items-center ml-0 mr-2 ring-[0.8px] h-[1.6rem] text-center ring-orange-500 border-black rounded-sm bg-white">
                            {reservation.numKids}
                          </span>
                          <div className="inline-block w-[40px] border-black">
                            {reservation.numKids > 1 ? "Kids" : "Child"}
                          </div>
                        </span>
                        <span className="border-black text-right -ml-5">
                          <span className="w-[67px] text-lg- inline-block mr-0 text-right border-black font-semibold">
                            $
                            {reservation.numKids *
                              getTourPrice(reservation.tour?.label)?.kidPrice!}
                            .00
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-0.5 mx-auto pl-4 text-left py-4">
                  <input
                    type="checkbox"
                    className="outline-none cursor-pointer"
                    checked={worksAtHotel}
                    onChange={() => setWorksAtHotel(!worksAtHotel)}
                  />
                  <div className="ml-3 inline-block text-zinc-600 select-none">
                    Do you work for the Agency/Hotel ?
                  </div>
                </div>
                {worksAtHotel && (
                  <div className="">
                    {/* DEPOSIT PAID CHECKBOX */}
                    <div className="flex flex-row w-full justify-between pl-4 pr-4 mb-2.5 border-black items-center">
                      <div className="inline-block text-sm++ container max-w-[7rem] text-right border-black shrink text-zinc-700">
                        Reserved By:
                      </div>
                      <input
                        type="text"
                        className="container max-w-[9.5rem] shrink-0 ml-5 pl-2.5 pr-1 placeholder-gray-500 py-[0.35rem] ring-1 ring-orange-400 rounded-sm outline-none text-sm++ bg-zinc-50 caret-zinc-600 border-black"
                        value={reservation.reservedBy}
                        onChange={(e) =>
                          setReservation((state: any) => ({
                            ...state,
                            reservedBy: e.target.value,
                          }))
                        }
                        placeholder="Name"
                      />
                    </div>
                    <hr className="mt-1 mx-2.5 border-t-[1.3px] border-zinc-700" />

                    {/* AMOUNT BOX */}
                    <div
                      className={`mt-0 mx-auto px-4 text-right py-5 flex justify-between`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          className="outline-none cursor-pointer"
                          checked={reservation.depositPaid}
                          onChange={() => {
                            setReservation((state: any) => ({
                              ...state,
                              depositPaid: !reservation.depositPaid,
                            }));
                          }}
                        />
                        <div className="mx-3 inline-block text-zinc-600 select-none">
                          Deposit Paid ?
                        </div>
                      </div>
                      {reservation.depositPaid && (
                        <div
                          className={`w-5/12 max-w-[8rem] flex flex-row ring-1 items-center border-black align-middle bg-zinc-50 rounded-sm+ px-2.5 -my-1.5 select-none ${
                            finalFormSubmitted &&
                            reservation.depositAmount === ""
                              ? "ring-red-500"
                              : "ring-orange-400"
                          }`}
                        >
                          <span
                            className={`font-[sans-serif] text-base border-black ${
                              reservation.depositAmount ? "" : "text-gray-500"
                            }`}
                          >
                            $
                          </span>
                          <input
                            type="text"
                            className="inline-block text-right py-[0.35rem] placeholder-gray-500 ml-1.5 outline-none w-full text-base bg-transparent caret-zinc-600 border-black"
                            placeholder="0.00"
                            value={reservation.depositAmount}
                            onChange={(e) => {
                              if (/^[0-9]*$/.test(e.target.value)) {
                                setReservation((state: any) => ({
                                  ...state,
                                  depositAmount: e.target.value,
                                }));
                              } else {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <hr className="mx-2 border-zinc-700" />
                <div className="border-red-500 mx-2 px-1.5 py-3.5">
                  <div className="flex justify-between text-lg font-semibold px-3">
                    <span className="">Total: </span>
                    <span>
                      <span className="text-lg- inline-block mr-0 text-right border-black font-semibold">
                        $
                        {reservation.totalPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        .00
                      </span>
                    </span>
                  </div>
                  {reservation.depositPaid && (
                    <div>
                      <div className="flex justify-between text-base px-3 mt-1">
                        <span className="">Deposit: </span>
                        <span>
                          <span className="text-lg- inline-block mr-0 text-right border-black">
                            ‑$
                            {reservation.depositAmount
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {reservation.depositAmount ? ".00" : "0.00"}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-base px-3 mt-1">
                        <span className="">Balance: </span>
                        <div className="inline-block">
                          <span className="text-lg- inline-block mr-0 text-right border-black">
                            $
                            {reservation.balance
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            .00
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {reservation.depositPaid && (
                  <hr className="mx-2 border-zinc-700" />
                )}

                <div
                  className={`flex -mb-1 justify-center ${
                    reservation.depositPaid ? "mt-4" : "mt-1"
                  }`}
                >
                  <button
                    disabled={checkDisableConfirmBtn()}
                    onChange={() => checkDisableConfirmBtn()}
                    onClick={() => handleNewReservation()}
                    className={`px-3 py-1.5 border w-full hover:saturate-[3] saturate-[2] text-xl
                    font-semibold border-gray-500 rounded-sm+ outline-none ${
                      checkDisableConfirmBtn()
                        ? "bg-neutral-400 text-white"
                        : "text-gray-700 bg-orange-300"
                    }`}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
