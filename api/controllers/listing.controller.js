import Listing from "../models/listing.model.js";

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    }
    catch (error) {
        console.log("An error occured: ", error);
    }
}