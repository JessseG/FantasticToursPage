import React from "react";
import Layout from "../components/Layout";

function Tours() {
  return (
    <div>
      {/*  TOUR  */}
      <div className="">
        {tours.map((tour) => {
          return (
            <div>
              <div>{tour.photo}</div>
              <div>{tour.name}</div>
              <div>{tour.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tours;
