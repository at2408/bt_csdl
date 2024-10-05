const CompanyModel = require("../models/company");
const EmployeeModel = require("../models/employee");
const TowerEmployeeModel = require("../models/towerEmployee");
const TowerServiceModel = require("../models/towerService");
const TowerServiceRecordModel = require("../models/towerServiceRecord");
const CheckCounterModel = require("../models/checkCounter");
const getCompanySeed = require("./companySeed");
const getEmployeeSeed = require("./employeeSeed");
const getTowerEmployeeSeed = require("./towerEmployeeSeed");
const TowerServiceSeed = require("./towerSerivceSeed");
const getTowerServiceRecordSeed = require("./towerServiceRecordSeed");
const getCheckCounterSeed = require("./checkCounterSeed");

const Seeder = async () => {
console.log("hi there")
	// save TowerServiceSeed to database
	if ((await TowerServiceModel.find()).length == 0) {
		await TowerServiceModel.insertMany(TowerServiceSeed);
	}

	if ((await EmployeeModel.find()).length == 0) {
		const employee = getEmployeeSeed();
		await EmployeeModel.insertMany(employee);
	}

	if ((await CompanyModel.find()).length == 0) {
	  await getCompanySeed()
	  // await CompanyModel.insertMany(company)
	}

	if ((await TowerEmployeeModel.find()).length == 0) {
		const towerEmployee = await getTowerEmployeeSeed()
		await TowerEmployeeModel.insertMany(towerEmployee)
	}

	if ((await TowerServiceRecordModel.find()).length == 0) {
	  const towerServiceRecord = await getTowerServiceRecordSeed()
	  await TowerServiceRecordModel.insertMany(towerServiceRecord)
	}

	if ((await CheckCounterModel.find()).length == 0) {
		const checkCounter = await getCheckCounterSeed()
		await CheckCounterModel.insertMany(checkCounter)
	}
}

module.exports = Seeder

