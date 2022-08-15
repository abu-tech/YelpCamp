const Campground = require("../models/campground");
const cities = require("./citiesin");
const { descriptors, places } = require("./seedhelper");
const mongoose = require('mongoose');
const { default: axios } = require("axios");

main().catch(err => console.log("ERROR CONNECTING DATABASE!!", err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("CONNECTED TO DATABASE!!")
}

async function seedImg() {
    try {
        const resp = await axios.get("https://api.unsplash.com/photos/random", {
            params: {
                client_id: "dl6_irMI7UoVn9f_4y8U0w_5FbXaXmDnqy6wr5PbI44",
                collection: 33767648688
            }
        });
        return resp.data.urls.small;
    } catch (err) {
        console.log(err);
    }
}

const sample = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const price = Math.floor(Math.random() * 6000) + 1;
        const rand = Math.floor(Math.random() * 406);
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].admin_name}`,
            geometry: { type: 'Point', coordinates: [cities[rand].lng, cities[rand].lat] },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                    url: 'https://res.cloudinary.com/dzgcoehkm/image/upload/v1660211273/yelp%20camp/fq0kp3kvjfe1mu5nti3n.jpg',
                    filename: 'yelp camp/fq0kp3kvjfe1mu5nti3n'
                },
                {
                    url: 'https://res.cloudinary.com/dzgcoehkm/image/upload/v1660062124/yelp%20camp/bk9xw8rfy30n9wuqnuot.jpg',
                    filename: 'yelp camp/bk9xw8rfy30n9wuqnuot'
                }
            ],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi, a maxime dolor eum molestias facilis. Aperiam possimus eos hic ex deserunt reiciendis quis excepturi sit, veritatis distinctio porro fuga vel!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae saepe dolorem iste nam ratione repellat accusantium quibusdam fugit alias unde explicabo possimus id odio sapiente quasi, deserunt maiores quia nostrum?",
            price,
            author: "62f14f77564531139b907f13"
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("DATABASE DISCONNECTED!");
});