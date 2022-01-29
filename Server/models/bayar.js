const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BayarSchema = mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},
	tagihan: {
		type: Schema.Types.ObjectId, 
		ref: 'Tagihan',
		required: true
	},
	siswa: {
		type: Schema.Types.ObjectId, 
		ref: 'Siswa',
		required: true
	}
})

module.exports = mongoose.model("Bayar", BayarSchema);