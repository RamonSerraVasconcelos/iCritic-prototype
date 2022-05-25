import mongoose from 'mongoose'

async function connection() {
    try {
        await mongoose.connect(<string>process.env.MONGOURL)
    } catch (error) {
        console.log(error)
    }
}

export default connection