const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
	email: {
		type: String
	},
	noTlp: {
		type: String
	},
	namaLengkap: {
		type: String
	},
	password: {
		type: String
	},
	imgUrl: {
		type: String
	},
	jenisKelamin: {
		type: Number // 1 laki-laki, 0 perempuan
	},
	tglLahir: {
		type: Date
	},
	alamat: {
		type: String
	},
	nik: {
		type: String,
		required: true
	},
	siswa: [{
		type: Schema.Types.ObjectId, 
		ref: 'Siswa',
		// required: true
	}],
	isAdmin: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model("User", UserSchema);