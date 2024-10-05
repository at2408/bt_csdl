const mongoose = require('mongoose');

const Schema = mongoose.Schema

const TowerServiceRecordSchema = new Schema(
	{
		startDate: {
			type: Date,
			required: true
		},
		endDate: {
			type: Date,
			required: true
		},
		income: {
			type: Number,
			required: true
		},
		targetIncome: {
			type: Number,
			required: true
		},
		service: {
			type: Schema.Types.ObjectId,
			ref: "TowerServices"
		},
		company: {
			type: Schema.Types.ObjectId,
			ref: "Company"
		},
		employees: [{
			type: Schema.Types.ObjectId,
			ref: "TowerEmployees"
		}],
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('TowerServiceRecords', TowerServiceRecordSchema)
