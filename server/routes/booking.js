const router = require("express").Router();

const Booking = require("../models/Booking");
const Listing = require("../models/listing");
const User = require("../models/user");

router.post("/create", async(req,res) =>{
    try{
        const {customerId,hostId,listingId,startDate,endDate,totalPrice} = req.body
        const newBooking=new Booking({customerId,hostId,listingId,startDate,endDate,totalPrice})
        await newBooking.save()
        res.status(200).json(newBooking)
    }catch(err){
        res.status(400).json({message:"Failed to create a booking", error:err.message})
    }
})

module.exports= router