const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const memberSchema = new mongoose.Schema({
    _id: ObjectId,
    userName: String,
    name: String,
    phone: Number,
    age: Number,
    address: String,
    gymname:String,
    feeHistory: [{
        registerdate: Date,
        feeDuration: Date,
        planeType: String,
        amount: Number,
    }],
    gymDetails: [{
        updateid:ObjectId,
        morningOpening: String,
        morningClosing: String,
        eveningOpening: String,
        eveningClosing: String,
        gymAddress: String,
        descreption: String
    }],
    dite: String,
    tokens: [{
        token: String
    }]
});


memberSchema.methods.generateMemberAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token
    } catch (error) {
        console.log(error);
    }
}

const member = mongoose.model("Member", memberSchema);
module.exports = member;