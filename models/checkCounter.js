const mongoose = require('mongoose');

const Schema = mongoose.Schema

const CheckCounterSchema = new Schema(
	{
		type: {
			type: Boolean,
			required: true,
		},
		employee: {
			type: Schema.Types.ObjectId,
			ref: "Employees",
			required: true,
		},
		checkTime: {
			type: Date,
			required: true,
		},
		checkDestination: {
			type: String,
			required: true,
			enum: ["F1", "B1", "B2"],
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('CheckCounters', CheckCounterSchema)
