const CompanyModel = require("../models/company")
const TowerEmployee = require("../models/towerEmployee")
const generate = require("./common")
const roundToTwo = generate.roundToTwo

getTowerServiceRecordSeed = async () => {
	const seeds = []
	const companies = await CompanyModel.find().populate("towerAttributes.services").exec();
	for (const dateTime of dateTimeHelper) {
		for (const company of companies) {
			const services = company.towerAttributes.services
			for (const service of services) {
				const serviceId = service._id
				const randomManager = await TowerEmployee.aggregate([
					{
						$match: {
						"towerServiceRank.service": serviceId,
						"towerServiceRank.position": "Manager",
						},
					},
					{ $sample: { size: 1 } },
				])
				const randomAssistant = await TowerEmployee.aggregate([
					{
						$match: {
						"towerServiceRank.service": serviceId,
						"towerServiceRank.position": "Assistant",
						},
					},
					{ $sample: { size: 1 } },
				])
				const randomStaff = await TowerEmployee.aggregate([
					{
						$match: {
						"towerServiceRank.service": serviceId,
						"towerServiceRank.position": "Staff",
						},
					},
					{ $sample: { size: 1 } },
				])

				seeds.push({
					startDate: dateTime.startDate,
					endDate: dateTime.endDate,
					income: roundToTwo(service.price * company.towerAttributes.priceRate),
					targetIncome: roundToTwo(service.price * 1.75),
					service: serviceId,
					company: company._id,
					employees: [
						randomManager[0]._id,
						randomAssistant[0]._id,
						randomStaff[0]._id,
					],
				})
			}
		}
	}
	return seeds
}

const dateTimeHelper = [
	{
		startDate: new Date("2024-01-01"),
		endDate: new Date("2024-01-31"),
	},
	{
		startDate: new Date("2024-02-01"),
		endDate: new Date("2024-02-29"),
	},
	{
		startDate: new Date("2024-03-01"),
		endDate: new Date("2024-03-31"),
	},
	{
		startDate: new Date("2024-04-01"),
		endDate: new Date("2024-04-30"),
	},
	{
		startDate: new Date("2024-05-01"),
		endDate: new Date("2024-05-31"),
	},
	{
		startDate: new Date("2024-06-01"),
		endDate: new Date("2024-06-30"),
	},
	{
		startDate: new Date("2024-07-01"),
		endDate: new Date("2024-07-31"),
	},
	{
		startDate: new Date("2024-08-01"),
		endDate: new Date("2024-08-31"),
	},
	{
		startDate: new Date("2024-09-01"),
		endDate: new Date("2024-09-30"),
	},
]

module.exports = getTowerServiceRecordSeed
