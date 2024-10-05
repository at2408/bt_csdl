const TowerServiceModel = require("../models/towerService")
const generate = require('./common')
const randomDateOfBirth = generate.randomDateOfBirth

const NUMBER_OF_TOWER_EMPLOYEES = 100

const towerEmployeeSeed = []
const positions = ["Manager", "Assistant", "Staff"]
const levels = ["1", "2", "3"]

getRandomService = async () => {
	const services = await TowerServiceModel.find().exec()
	const amountService = Math.floor(Math.random() * 3) + 1
	return Array.from({ length: amountService }).map(() => {
		return {
			service: services.map((service) => service._id)[
				Math.floor(Math.random() * services.length)
			],
			level: levels[Math.floor(Math.random() * levels.length)],
			position: positions[Math.floor(Math.random() * positions.length)],
		}
	})
}

getTowerEmployeeSeed = async () => {
	for (let i = 0; i < NUMBER_OF_TOWER_EMPLOYEES; i++) {
		const towerServiceRank = await getRandomService()
		towerEmployeeSeed.push({
			employeeID: `TW_EPL-${i}`,
			name: `Employee ${i}`,
			dob: randomDateOfBirth(),
			address: `Address ${i}`,
			towerServiceRank: towerServiceRank,
		})
	}
	return towerEmployeeSeed
}

module.exports = getTowerEmployeeSeed
