var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    container: { type: Schema.Types.ObjectId, ref: 'Container' },
    title: { type: String },
    labels: [{ type: String }],
    content: {},
    creationDate: { type: Date }
});

module.exports = mongoose.model('Log', logSchema);