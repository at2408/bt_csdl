const generate = {
	randomNumber: (length) => {
		return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1))
	},
	  
	roundToTwo: (num) => {
		return +(Math.round(Number(num + "e+2")) + "e-2")
	},
	  
	randomDateOfBirth: () => {
		const start = new Date("1970-01-01")
		const end = new Date("2003-12-31")
		return new Date(
			start.getTime() + Math.random() * (end.getTime() - start.getTime())
		)
	},
	  
	randomDate: (startDate, endDate) => {
		return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
	},
}

module.exports = generate
