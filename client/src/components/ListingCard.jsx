import React, { useState } from "react";
import "../styles/ListingCard.scss";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
}) => {
  //slider for images
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevSlide = () => {
    setCurrentIndex((prev) =>( prev-1+listingPhotoPaths.length) % listingPhotoPaths.length)
  };
  const goToNextSlide = () => {
    setCurrentIndex((prev) =>( prev+1) % listingPhotoPaths.length)
  };

  const navigate =useNavigate();
  const handleCardClick = () => {
    navigate(`/properties/${listingId}`);
  };
  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="slider-container">
        <div className="slider" style={{transform:`translateX(-${currentIndex*100}%)`}}>
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3001/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              <div className="prev-button" onClick={goToPrevSlide}>
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div className="next-button" onClick={goToNextSlide}>
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3>{city}, {province}, {country}</h3>
      <p>{category}</p>
      <p>{type}</p>
      <p><span>${price}</span> per night</p>
    </div>
  );
};

export default ListingCard;
