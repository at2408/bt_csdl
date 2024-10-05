const mongoose = require('mongoose');

const Schema = mongoose.Schema

const CompanySchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		taxCode: { 
			type: String, 
			required: true 
		},
		capital: {
			type: Number
		},
		field: { 
			type: String
		},
		employeesAmount: { 
			type: Number 
		},
		phoneNumber: { 
			type: String,
			required: true
		},
		employees: [{
			type: Schema.Types.ObjectId,
			ref: "Employees"
		}],
		towerAttributes: {
			floor: { type: Number, required: true },
			room: { type: String, required: true },
			size: { type: Number, required: true },
			services: [{ type: Schema.Types.ObjectId, ref: "TowerServices" }],
			priceRate: { type: Number, required: true },
		},
		status: {
			type: Boolean,
			default: true 
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Companies', CompanySchema)
