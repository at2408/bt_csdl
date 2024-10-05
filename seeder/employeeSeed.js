const generate = require('./common');

const randomDateOfBirth = generate.randomDateOfBirth
const randomNumber = generate.randomNumber

const NUMBER_OF_EMPLOYEES = 1000

getEmployeeSeed = () => {
	return Array.from({ length: NUMBER_OF_EMPLOYEES }).map((_, i) => {
		const employeeID = `EPL${i + 1}`
		const identityCardNumber = randomNumber(12)
		const name = `Employee ${i + 1}`
		const dob = randomDateOfBirth()
		const phoneNumber = randomNumber(10)
		const status = true

	return {
			employeeID,
			identityCardNumber,
			name,
			dob,
			phoneNumber,
			status,
		}
	})
}

module.exports = getEmployeeSeed
