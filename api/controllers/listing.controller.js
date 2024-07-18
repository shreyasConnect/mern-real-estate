import Listing from "../models/listing.model.js";

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    }
    catch (error) {
        console.log("An error occured: ", error);
    }
};

export const deleteListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        res.status(404).json("Listing not found!");
    }

    if (req.user.id !== listing.userRef) {
        res.status(401).json("You can only view your listing.")
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing deleted successfully!");
    } catch (error) {
        console.log("An error occured: ", error);
    }
};

export const updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        res.status(404).json('Listing not found!');
    }
    if (req.user.id !== listing.userRef) {
        res.status(401).json('You can only update your own listings!');
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        console.log("An error occured: ", error);
    }
};