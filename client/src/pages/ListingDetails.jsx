import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ListingDetails.scss";
import { facilities } from "../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  console.log(listingId);
  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log(data);
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };
  useEffect(() => {
    getListingDetails();
  }, []);

  //booking calendar
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    //update the selected date range when user selects
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); //calculate the difference in days unit
  return loading ? (
    <Loader />
  ) : (
    <>
    <Navbar />
    <div className="listing-details">
      <div className="title">
        <h1>{listing.title}</h1>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="listing image"
            />
          ))}
        </div>
        <h2>
          {listing.type} in {listing.city}, {listing.procince},{" "}
          {listing.country}{" "}
        </h2>
        <p>
          {listing.guestCount} guest(s) - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} beds(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />
        <div className="profile">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
            alt="profile image"
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />
        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        <div className="booking">
          <div>
            <h2>What does this place offer?</h2>
            <div className="amenities">
              {listing.amenities[0].split(',').map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {facilities.find((facility) => facility.name === item).icon}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              <h2>
                ${listing.price} x {dayCount} night(s)
              </h2>
              <h2>Total Price: ${listing.price * dayCount}</h2>
              <p>Start Date:{dateRange[0].startDate.toDateString()}</p>
              <p>End Date:{dateRange[0].endDate.toDateString()}</p>
              <button className="button" type="submit">
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
