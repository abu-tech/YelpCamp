const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviews");
const mongoosePaginate = require("mongoose-paginate-v2");


const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('crop').get(function() {
    return this.url.replace('/upload', '/upload/w_600,h_350,c_limit/e_improve');
});

ImageSchema.virtual('showImg').get(function() {
    return this.url.replace('/upload', '/upload/w_638,h_360,c_fill/');
});

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}...</p>`
})

campgroundSchema.post("findOneAndDelete", async function(camp) {
    if (camp) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
});

campgroundSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Campground", campgroundSchema);