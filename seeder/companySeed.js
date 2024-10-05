const mongoose = require("mongoose")
const CompanyModel = require("../models/company")
const EmployeeModel = require("../models/employee")
const TowerServiceModel = require("../models/towerService")
const generate = require('./common')
const randomNumber = generate.randomNumber

const NUMBER_OF_COMPANIES = 10

const randomField = () => {
	const fields = [
		"Software",
		"Hardware",
		"Education",
		"Finance",
		"Health",
		"Agriculture",
		"Transportation",
		"Real Estate",
		"Construction",
		"Retail",
		"Entertainment",
		"Tourism",
		"Others",
	]
	return fields.sort(() => Math.random() - 0.5)[0]
}

const getPriceRate = (employeesAmount, floorSize) => {
	const baseRate = 1.0 // Base price rate
	const employeeIncrement = Math.floor((employeesAmount - 10) / 5) * 0.05
	const floorSizeIncrement = Math.floor((floorSize - 100) / 10) * 0.05
	const totalIncrement = Math.max(0, employeeIncrement) + Math.max(0, floorSizeIncrement)
	return Math.round((baseRate + totalIncrement) * 100) / 100
}

const getCompanySeed = async () => {
	const essentialService = await TowerServiceModel.find({ essential: true }).exec();
	const extraService = await TowerServiceModel.find({ essential: false }).exec();
	const essentialServiceIds = essentialService.map((service) => service._id);
	const extraServiceIds = extraService.map((service) => service._id);
	const employeesAmount = randomNumber(2)

	for (let i = 0; i < NUMBER_OF_COMPANIES; i++) {
		const employees = await EmployeeModel.aggregate([
			{ $match: { status: true, company: null } },
			{ $sample: { size: employeesAmount } },
		])
		const taxCode = randomNumber(6)
		const capital = randomNumber(10)
		const field = randomField()
		const phoneNumber = randomNumber(10)
		const size = i % 2 === 0 ? randomNumber(2) : randomNumber(3)

		const extraServiceAmount = Math.floor(Math.random() * extraServiceIds.length)
		const randomExtraServiceIds = extraServiceIds.filter((_, i) => i < extraServiceAmount)

		const company = {
			_id: mongoose.Types.ObjectId(),
			name: `Company ${i + 1}`,
			taxCode,
			capital,
			field,
			employeesAmount,
			employees: employees,
			phoneNumber,
			towerAttributes: {
				floor: randomNumber(2),
				room: randomNumber(3),
				size,
				services: [essentialServiceIds, randomExtraServiceIds].flat(),
				priceRate: getPriceRate(employeesAmount, size),
			},
			status: true,
		}
		await CompanyModel.create(company)
		await EmployeeModel.updateMany(
			{ _id: { $in: employees.map((employee) => employee._id) } },
			{ company: company._id }
		)
	}
}

module.exports = getCompanySeed
