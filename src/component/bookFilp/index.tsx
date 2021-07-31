import React, { useEffect } from "react";
import { useInterval, useToggle } from "react-use";
import "./style.css";

const BookFilp = () => {
  const [isFilpEnd, toggle] = useToggle(false);

  useEffect(() => {
    toggle();
  }, []);

  useInterval(() => {
    toggle();
  }, 167 * 7);

  return (
    <div className={`book ${isFilpEnd ? "filp-end" : ""}`}>
      <div className="back bg-gray-600"></div>
      <div className="book-page page6"></div>
      <div className="book-page page5"></div>
      <div className="book-page page4"></div>
      <div className="book-page page3"></div>
      <div className="book-page page2"></div>
      <div className="book-page page1"></div>
      <div className="front bg-gray-600"></div>
    </div>
  );
};

export default BookFilp;
