const mongoose = require('mongoose');

const Schema = mongoose.Schema

const TowerServiceSchema = new Schema(
	{
		serviceID: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		essential: {
			type: Boolean,
			required: true,
			default: false
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('TowerServices', TowerServiceSchema)
