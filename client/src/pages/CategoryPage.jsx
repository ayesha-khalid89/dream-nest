import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [categoryListing,setCategoryListing]= useState({ listings: null })
  const categoryLabel = useParams();
  const getFeedListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/properties?category=${categoryLabel.categoryId}`,
        { method: "GET" }
      );
      const data = await response.json();
      setCategoryListing({ listings: data });
      setLoading(false);
    } catch (err) {
      console.log("fetch category listings failed", err.message);
    }
  };
  useEffect(()=>{
    getFeedListings();
  },[])
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{categoryLabel.categoryId} List</h1>
      <div className="list">
        {categoryListing.listings.map(
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

export default CategoryPage;
