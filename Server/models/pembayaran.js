const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PembayaranSchema = mongoose.Schema({
	invoice: {
		type: String,
		require: true
	},
	status: {
		type: Number,
		default: 0, // 0 belum bayar, 1 sudah bayar/ menunggu verifikasi, 2 lunas, 3 gagal verifikasi
		require: true
	},
	nominal: {
		type: Number,
		require: true
	},
	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User',
		require: true
	},
	tagihan: [{
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
		kategoriBackup: {
			type: Object
		},
		kelas: {
			type: Schema.Types.ObjectId, 
			ref: 'Kelas',
		},
		kelasBackup: {
			type: Object
		},
		siswa: {
			type: Schema.Types.ObjectId, 
			ref: 'Siswa',
		},
		siswaBackup: {
			type: Object
		},
	}],
	buktiPembayaran: [{
		// _id: false,
		verify: {
			type: Number,
			default: 0 // 0 default, 1 terverifikasi, 2 gagal verifikasi
		},
		imgUrl: {
			type: String
		}
	}],
	waktuPelunasan: {
		type: Date
	},
	rekening: {
		type: Schema.Types.ObjectId, 
		ref: 'Rekening',
		require: true
	},
	rekeningBackup: {
		type: Object
	},
})

module.exports = mongoose.model("Pembayaran", PembayaranSchema);