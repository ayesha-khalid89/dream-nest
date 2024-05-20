import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const dispatch = useDispatch();
  let listings = useSelector((state) => state.listings) ;
  console.log("listings",listings)
  const getSearchListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/search/${search}`,
        { method: "GET" }
      );
      const data = await response.json();
      dispatch(setListings({listings:data}));
      setLoading(false);
    } catch (err) {
        console.log("Fetch search listing failed", err.message)
    }
  };

  useEffect(()=>{
    getSearchListings()
  },[search])
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      <div className="list">
        {listings?.map(
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

export default SearchPage;
