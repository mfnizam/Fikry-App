const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagihanSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	deskripsi: {
		type: String,
		required: true
	},
	nominal: {
		type: Number,
		required: true
	},
	waktuMulai:{
		type: Date
	},
	waktuAkhir: {
		type: Date
	},
	kategori: {
		type: Schema.Types.ObjectId, 
		ref: 'Kategori',
		required: true
	},
	kelas: [{
		type: Schema.Types.ObjectId, 
		ref: 'Kelas',
	}],
	delete: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model("Tagihan", TagihanSchema);