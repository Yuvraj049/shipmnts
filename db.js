const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const con = await mongoose.connect("mongodb+srv://Yuvraj:yuvraj3002@cluster0.pvjgjmm.mongodb.net/usersdata?retryWrites=true&w=majority", {
    });
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection failed: ' + error);
  }
};
connectDB();