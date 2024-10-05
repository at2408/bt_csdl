const EmployeeModel = require("../models/employee")
const generate = require("./common")
const randomDate = generate.randomDate
const randomNumber = generate.randomNumber

const START_DATE = new Date("2024-01-01")
const END_DATE = new Date("2024-10-01")

getCheckCounterSeed = async () => {
	const employees = await EmployeeModel.find()
	const checkCounterSeed = []
	for (const employee of employees) {
		const numberCheckIn = randomNumber(1)
		const numberCheckOut = randomNumber(1)
		checkCounterSeed.push(
			...Array.from({ length: numberCheckIn }, () => ({
				type: true,
				employee: employee._id,
				checkTime: randomDate(START_DATE, END_DATE),
				checkDestination: randomDestination(),
			})),
			...Array.from({ length: numberCheckOut }, () => ({
				type: false,
				employee: employee._id,
				checkTime: randomDate(START_DATE, END_DATE),
				checkDestination: randomDestination(),
			}))
		)
	}
	return checkCounterSeed
}

// function get random from 3 destination
randomDestination = () => {
	const destinations = ["F1", "B1", "B2"]
	return destinations[Math.floor(Math.random() * destinations.length)]
}

module.exports = getCheckCounterSeed
