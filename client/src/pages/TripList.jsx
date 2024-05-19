import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
  const dispatch = useDispatch();
  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log(data);
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("fetch trip list failed", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trips List</h1>
      <div className="list">
        {tripList?.map(({ listingId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
            key={listingId._id}
            listingId={listingId._id}
            listingPhotoPaths={listingId.listingPhotoPaths}
            city={listingId.city}
            province={listingId.province}
            country={listingId.country}
            category={listingId.category}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            booking={booking}
          />
        ))}
      </div>
    </>
  );
};

export default TripList;
