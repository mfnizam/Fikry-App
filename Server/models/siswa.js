const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiswaSchema = mongoose.Schema({
	namaLengkap: {
		type: String,
		required: true
	},
	nisn: { // nomer induk siswa nasional
		type: String,
		required: true
	},
	jenisKelamin: {
		type: Number,
		required: true
	},
	kelas: {
		type: Schema.Types.ObjectId, 
		ref: 'Kelas',
		required: true
	},
	imgUrl: {
		type: String
	},
	hasParent: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model("Siswa", SiswaSchema);