const mongoose = require('mongoose');

const Schema = mongoose.Schema

const TowerEmployeeSchema = new Schema(
	{
		employeeID: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		dob: {
			type: Date,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		towerServiceRank: [
			{
				service: {
					type: Schema.Types.ObjectId,
					ref: "TowerServices"
				},
				level: {
					type: String,
					required: true
				},
				position: {
					type: String,
					required: true
				},
			},
		],
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('TowerEmployees', TowerEmployeeSchema)
