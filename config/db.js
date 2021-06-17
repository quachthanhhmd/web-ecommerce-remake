const mongoose = require('mongoose')

const URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        console.log('DB connected!')
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectDB;