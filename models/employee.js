const mongoose = require('mongoose');

const Schema = mongoose.Schema

const EmployeeSchema = new Schema(
	{
		employeeID: {
			type: String,
			required: true,
			unique: true
		},
		identityCardNumber: {
			type: String,
			required: true,
			unique: true
		},
		name: {
			type: String,
			required: true
		},
		dob: {
			type: Date,
			required: true
		},
		phoneNumber: {
			type: String,
			required: true
		},
		company: {
			type: Schema.Types.ObjectId,
			ref: "Companies"
		},
		status: {
			type: Boolean,
			required: true
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Employees', EmployeeSchema)
