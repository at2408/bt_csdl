const path = require('path');
const express = require('express');

const mongoose = require('mongoose');

const config = require('./config/config')

const app = express();

const taskController = require('./controllers/task');

const Seeder = require('./seeder/seeder');


app.set('view engine', 'ejs');
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', async (req, res, next) => {
    next();
});

app.use('/quest1', async (req, res) => {
	const companies = await taskController.quest1();
	return res.render('quest1', { pageTitle: 'Quest 1', companies: companies });
});

app.use('/quest2', async (req, res) => {
	const result = await taskController.quest2('2024-10-01');
	//console.log(result)
	return res.render('quest2', { pageTitle: 'Quest 2', result: result });
});

app.use('/quest3', async (req, res) => {
	const result = await taskController.quest3();
	//console.log(result)
	return res.render('quest3', { pageTitle: 'Quest 3', result: result });
});

app.use('/product', (req, res, next) => {
    console.log("In the middleware product");
    //res.send('<h1>Hello from Express!</h1>');
    res.render('product', { pageTitle: 'Add Product'})
})

mongoose.connect(config.MONGO_URI, {})
	.then(() => {
		console.log("Connected to MongoDB")
	})
	.then(() => Seeder())
	.then(() => {
		console.log("Seed data successfully")
	})
	.catch((error) => {
		console.log("Failed to connect to MongoDB", error)
	})
app.listen(3000)