const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    courseNumber: { type: Number, required: true },
    courseDept: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdDate: { type: Date, default: Date.now },
    CRN: {type: String, required: true},
    season: {type: String, required: true},
    year: {type: Number, required: true},
    public: {type: Boolean, required: true},
    accessCode: {type: String, required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]

});

schema.index({courseNumber:1, courseDeptCode:1, CRN: 1, season: 1, year: 1}, { unique: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', schema);
