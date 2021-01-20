const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        hash: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: {type:String, required: true},
        createdDate: { type: Date, default: Date.now },
        // Allow students to keep a list of ObjectId of the courses that they signed up for
        courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
    }
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
