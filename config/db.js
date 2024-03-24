const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(`${process.env.ATLAS_URL}/docApp`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options if needed
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connectToDb;
