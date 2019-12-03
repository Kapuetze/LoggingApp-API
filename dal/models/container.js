var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var containerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String },
    creationDate: { type: Date }
});

module.exports = mongoose.model('Container', containerSchema);