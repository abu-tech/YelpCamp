const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async(req, res) => {
    const allCampgrounds = await Campground.find({});
    const campgrounds = await Campground.paginate({}, {
        page: req.query.page || 1,
        limit: 10,
        sort: "-_id",
    });
    campgrounds.page = Number(campgrounds.page);
    let totalPages = campgrounds.totalPages;
    let currentPage = campgrounds.page;
    let startPage;
    let endPage;

    if (totalPages <= 10) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }
    res.render("campgrounds/index", {
        allCampgrounds,
        campgrounds,
        startPage,
        endPage,
        currentPage,
        totalPages
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        countries: ["in"],
        limit: 1
    }).send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user;
    await camp.save();
    req.flash("success", "Successfully made a new Campground!");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async(req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: "reviews",
        options: {
            sort: { "_id": -1 }
        },
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash("error", "Cannot find that Campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
}

module.exports.renderEditForm = async(req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { camp });
}

module.exports.updateCampground = async(req, res) => {
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    if (!camp) {
        req.flash("error", "Cannot find that Campground!");
        return res.redirect("/campgrounds");
    }
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        camp.images.push(...imgs);
    }
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }, { new: true, runValidators: true });
        console.log(camp);
    }
    req.flash("success", "Successfully updated a Campground!");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async(req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    for (let image of camp.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash("success", "Successfully deleted a Campground!");
    res.redirect("/campgrounds");
}