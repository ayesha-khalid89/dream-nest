const router = require("express").Router();

const Booking = require("../models/Booking");
const Listing = require("../models/listing");
const User = require("../models/user");


//get trip list

router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );
    res.status(200).json(trips);
  } catch (err) {
    res.status(404).json({ message: "trips not found", error: err.message });
    console.log("trips not found");
  }
});

//add listing to wishlist
router.patch("/:userId/:listingId", async(req,res) =>{
  try{
    const {userId,listingId} =req.params
    const user=await User.findById(userId)
    const listing =await Listing.findById(listingId).populate("creator")
    const favoriteListing=user.wishList.find((item) => item._id.toString() === listingId)
    if(favoriteListing){
      user.wishList=user.wishList.filter((item) => item._id.toString() !== listingId)
    }
    else{
      user.wishList.push(listing)
    }
    await user.save()
    res.status(200).json({message: "wishlist updated", wishList:user.wishList})
  }catch(err){
    res.status(404).json({message:"wishlist not updated ", error:err.message})
  }
})

module.exports = router;