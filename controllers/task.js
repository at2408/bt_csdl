const CompanyModel = require("../models/company");
const checkCounterModel = require("../models/checkCounter");
const towerServiceRecordModel = require("../models/towerServiceRecord")
const config = require("../config/config")
const moment = require('moment')
const PipelineStage = require("mongoose")
const UNIT_PRICE = config.UNIT_PRICE
const SALARY_BASE = config.SALARY_BASE
const SalaryRate = config.SalaryRate
const formatVND = config.formatVND

exports.quest1 = async() => {
	const companies = await CompanyModel.aggregate([
		{
			$unset: ["createdAt", "updatedAt", "employees"],
		},
		{
			$lookup: {
				from: "towerservicerecords",
				let: { company: "$_id" },
				pipeline: [
					{
						$match: {
						$expr: {
							$eq: ["$company", "$$company"],
						},
						},
					},
					{
						$group: {
						_id: {
							startDate: "$startDate",
							endDate: "$endDate",
						},
						totalServiceBill: {
							$sum: "$income",
						},
						},
					},
					{
						$sort: {
						"_id.startDate": 1,
						"_id.endDate": 1,
						},
					},
				],
				as: "serviceRecords",
			},
		},
		{
			$project: {
				name: 1,
				billByMonth: {
					$map: {
						input: "$serviceRecords",
						as: "record",
						in: {
						startDate: "$$record._id.startDate",
						endDate: "$$record._id.endDate",
						totalServiceBill: "$$record.totalServiceBill",
						rentBill: {
							$multiply: ["$towerAttributes.size", UNIT_PRICE],
						},
						totalBill: {
							$add: [
							"$$record.totalServiceBill",
							{ $multiply: ["$towerAttributes.size", UNIT_PRICE] },
							],
						},
						},
					},
				},
				totalBill: {
					$sum: {
						$map: {
						input: "$serviceRecords",
						as: "record",
						in: {
							$add: [
							"$$record.totalServiceBill",
							{ $multiply: ["$towerAttributes.size", UNIT_PRICE] },
							],
						},
						},
					},
				},
			},
		},
		{
			$sort: {
				totalBill: -1,
			},
		},
	]).limit(10)

	for(let company of companies) {
		company.totalBill = formatVND(company.totalBill)
	}
	return companies
}


exports.quest2 = async (dateInput) => {
	if (!dateInput) {
	  return "Please provide a date"
	}
	const date = moment(dateInput, "YYYY-MM-DD", true)
	if (!date.isValid()) {
	  return "Invalid date format"
	}
	const checkCounterByDate = await checkCounterModel.aggregate([
		{
			$match: {
			checkTime: {
				$gte: date.startOf("day").toDate(),
				$lte: date.endOf("day").toDate(),
			},
			},
		},
		{
			$lookup: {
			from: "employees",
			localField: "employee",
			foreignField: "_id",
			as: "employee",
			},
		},
		{
			$unwind: "$employee",
		},
		{
			$lookup: {
			from: "companies",
			localField: "employee.company",
			foreignField: "_id",
			as: "company",
			},
		},
		{
			$unwind: "$company",
		},
		{
			$project: {
				_id: 0,
				type: 1,
				checkTime: 1,
				checkDestination: 1,
				employee: {
					employeeID: 1,
					name: 1,
					dob: 1,
					phoneNumber: 1,
					identityCardNumber: 1,
				},
				employeeOfCompany: "$company.name",
			},
		},
		{
			$group: {
				_id: "$employee",
				employeeOfCompany: { $first: "$employeeOfCompany" },
				employee: { $first: "$employee" },
				checkIn: {
					$sum: {
						$cond: [{ $eq: ["$type", true] }, 1, 0],
					},
				},
				checkInRecord: {
					$push: {
						$cond: [
							{ $eq: ["$type", true] },
							{
							$cond: [
								{ $ne: ["$checkTime", null] },
								{
								checkTime: "$checkTime",
								checkDestination: "$checkDestination",
								},
								"$$REMOVE",
							],
							},
							"$$REMOVE",
						],
					},
				},
				checkOut: {
					$sum: {
						$cond: [{ $eq: ["$type", false] }, 1, 0],
					},
				},
				checkOutRecord: {
					$push: {
						$cond: [
							{ $eq: ["$type", false] },
							{
							$cond: [
								{ $ne: ["$checkTime", null] },
								{
								checkTime: "$checkTime",
								checkDestination: "$checkDestination",
								},
								"$$REMOVE",
							],
							},
							"$$REMOVE",
						],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				employee: 1,
				employeeOfCompany: 1,
				checkIn: 1,
				checkOut: 1,
				checkInRecord: {
					$filter: {
					input: "$checkInRecord",
					as: "record",
					cond: { $ne: ["$$record", null] },
					},
				},
				checkOutRecord: {
					$filter: {
					input: "$checkOutRecord",
					as: "record",
					cond: { $ne: ["$$record", null] },
					},
				},
			},
		},
	]).limit(10)
	
	let result = checkCounterByDate.map(check => {
		return {
			employeeName: check.employee.name,
			employeeOfCompany: check.employeeOfCompany,
			checkInTime: check.checkInRecord.length > 0 ? moment(check.checkInRecord[0].checkTime).format('MM/DD/YYYY HH:mm:ss') : '',
			checkInDestination: check.checkInRecord.length > 0 ? check.checkInRecord[0].checkDestination : '',
			checkOutTime: check.checkOutRecord.length > 0 ? moment(check.checkOutRecord[0].checkTime).format('MM/DD/YYYY HH:mm:ss') : '',
			checkOutDestination: check.checkOutRecord.length > 0 ? check.checkOutRecord[0].checkDestination : '',
		}
	})
	return result
}

exports.quest3 = async () => {
	const pipeline = [
		{
			$lookup: {
				from: "toweremployees",
				localField: "employees",
				foreignField: "_id",
				as: "employees",
			},
		},
		{
			$unwind: "$employees",
		},
		{
			$lookup: {
				from: "towerservices",
				localField: "service",
				foreignField: "_id",
				as: "service",
			},
		},
		{
			$unwind: "$service",
		},
		{
			$addFields: {
				employeeServiceRank: {
					$arrayElemAt: [
						{
							$filter: {
							input: "$employees.towerServiceRank",
							as: "rank",
							cond: {
								$eq: ["$$rank.service", "$service._id"],
							},
							},
						},
						0,
					],
				},
				employeeName: "$employees.name",
				employee: "$employees._id",
			},
		},
		{
			$addFields: {
				employeeRank: {
					$concat: [
						"$employeeServiceRank.position",
						"_",
						"$employeeServiceRank.level",
					],
				},
			},
		},
		{
			$unset: ["employees"],
		},
		{
			$addFields: {
				salary: {
					$cond: {
						if: { $lt: ["$income", "$targetIncome"] },
						then: SALARY_BASE,
						else: {
							$sum: [
								SALARY_BASE,
								{
									$multiply: [
									{
										$subtract: ["$income", "$targetIncome"],
									},
									{
										$switch: {
										branches: [
											{
												case: { $eq: ["$employeeRank", "Staff_1"] },
												then: SalaryRate.Staff_1,
											},
											{
												case: { $eq: ["$employeeRank", "Staff_2"] },
												then: SalaryRate.Staff_2,
											},
											{
												case: { $eq: ["$employeeRank", "Staff_3"] },
												then: SalaryRate.Staff_3,
											},
											{
												case: { $eq: ["$employeeRank", "Assistant_1"] },
												then: SalaryRate.Assistant_1,
											},
											{
												case: { $eq: ["$employeeRank", "Assistant_2"] },
												then: SalaryRate.Assistant_2,
											},
											{
												case: { $eq: ["$employeeRank", "Assistant_3"] },
												then: SalaryRate.Assistant_3,
											},
											{
												case: { $eq: ["$employeeRank", "Manager_1"] },
												then: SalaryRate.Manager_1,
											},
											{
												case: { $eq: ["$employeeRank", "Manager_2"] },
												then: SalaryRate.Manager_2,
											},
											{
												case: { $eq: ["$employeeRank", "Manager_3"] },
												then: SalaryRate.Manager_3,
											},
										],
											default: 0,
										},
									},
									],
								},
							],
						},
					},
				},
			},
		},
		{
			$group: {
				_id: {
					startDate: "$startDate",
					endDate: "$endDate",
					employee: "$employee",
				},
				employee: {
					$first: "$employeeName",
				},
				salary: {
					$sum: "$salary",
				},
				serviceName: {
					$addToSet: "$service.name",
				},
			},
		},
		{
			$sort: {
				"_id.startDate": 1,
				"_id.endDate": 1,
			},
		},
	]
	const records = await towerServiceRecordModel.aggregate(pipeline).limit(10)
	const result = records.map(record => {
		return {
			startDate: moment(record._id.startDate).format('MM/DD/YYYY'),
			endDate: moment(record._id.endDate).format('MM/DD/YYYY'),
			employee: record.employee,
			salary: formatVND(record.salary),
			serviceName: record.serviceName.join(', ')
		}
	});

	return result
  }