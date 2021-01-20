const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    commentContent: { type: Array, default: [] },
    pdf: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    datePosted: {type: Date, default: new Date()},
    title: {type: String, required: true},
    authors: {type: String, required: true},
    upvotes: {type: Number, default: 0},
    studentID: {type: Schema.Types.ObjectId, ref: "User", required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comment', schema);
