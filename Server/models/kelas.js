const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KelasSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model("Kelas", KelasSchema);