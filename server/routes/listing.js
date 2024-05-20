const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/listing");
const User = require("../models/user");

//configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Create Listing
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos) {
      return res.status(400).send("No file uploaded");
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path);
    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });
    await newListing.save();
    res.status(200).json(newListing);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Failed to create listing", error: err.message });
    console.log("Failed to create listing");
  }
});

//Get Listing by category
router.get("/", async (req, res) => {
  const qCategory = req.query.category;

  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await Listing.find().populate("creator");
    }
    res.status(200).json(listings);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Failed to fetch listing", error: err.message });
    console.log("Failed to fetch listing");
  }
});

//get listing by search
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];
    if ((search === "all")) {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }
    res.status(200).json(listings);
  } catch (err) {
    res
      .status(409)
      .json({
        message: "Failed to fetch searched listing",
        error: err.message,
      });
    console.log("Failed to fetch searched listing");
  }
});

//get listing details

router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(200).json(listing);
  } catch (err) {
    res.status(404).json({ message: "listing not found", error: err.message });
    console.log("listing not found");
  }
});

module.exports = router;
