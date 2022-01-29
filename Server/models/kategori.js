const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KategoriSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model("Kategori", KategoriSchema);