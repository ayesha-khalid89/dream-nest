import React from "react";
import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Navbar />
      <Slide />
      <Categories />
      {user && <Listings />}
    </>
  );
};

export default HomePage;
