import mongoose from 'mongoose'

const profileSchema = mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    // age:Number,
    phoneNumber: String,
    businessName: String,
    contactAddress: String, 
    logo: String,
    website: String,
    userId: [String],
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile