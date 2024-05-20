import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import { setPropertyList } from "../redux/state";
import Footer from "../components/Footer";
const PropertyList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const propertyList = user?.propertyList;
  const getPropertyList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/properties`,
        { method: "GET" }
      );
      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      console.log("Property list fetching failed", err.message);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              creator={creator}
              listingId={_id}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default PropertyList;
