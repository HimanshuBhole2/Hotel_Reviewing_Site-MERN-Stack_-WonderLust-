const mongoose = require("mongoose");
const initData = require("./data.js");
const ListingModel = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await ListingModel.deleteMany({});
  initData.data =  await initData.data.map((obj)=>({...obj,owner:"659027754d827d3669f694ee"}))
  await ListingModel.insertMany(initData.data);
  console.log("data was reinitialized");
};

initDB();