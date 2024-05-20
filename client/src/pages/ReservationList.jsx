import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import { setReservationList } from "../redux/state";
import Footer from "../components/Footer";
const ReservationList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const reservationList = user.reservationList;
  console.log("redux", reservationList)
  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/reservations`,
        { method: "GET" }
      );
      const data = await response.json();
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Property list fetching failed", err.message);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
            key={listingId._id}
            creator={hostId._id}
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
      <Footer />
    </>
  );
};

export default ReservationList;