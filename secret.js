require('dotenv').config()

const serverPort=process.env.PORT || 5002 //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
const mongoUrl=process.env.MONGO_URL || "mongodb://localhost:27017/ecommerceMern"

//const defaultImagePath=process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.jpg'

module.exports = {serverPort,mongoUrl}