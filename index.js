/* Core Modules */
const fs = require('fs'); //In order to read files, you'll need a file system module. FS = File System
const http = require ('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // Read file from current OU
const laptopData = JSON.parse(json); // Parse the JSON data to return an object

// Each time someone access this server we want to call back this function.
const server = http.createServer((request, response) => {

	// Gets your URL path and stores it into a variable
	const pathName = url.parse(request.url, true).pathname;
	const id = url.parse(request.url, true).query.id;

	// PRODUCTS URL
	if (pathName === '/products' || pathName === '/') {
		response.writeHead(200, {'Content-Type': 'text/html'}); // This will respond by writing a header (which is the status code 200 or 404)

		// Replace HTML template onto the URL
		fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
				let overviewOutput = data;

				fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

				const cardsOutPut = laptopData.map (el => replaceTemplate(data, el)).join('');
				overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutPut);
				response.end(overviewOutput);
			});
		});

	}

	//LAPTOP URL
	else if (pathName === '/laptop' && id < laptopData.length) {
		response.writeHead(200, {'Content-Type': 'text/html'});

		// Replace HTML template onto the URL
		fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
			const laptop = laptopData[id];
			const output = replaceTemplate(data, laptop);
			response.end(output)
		});
	}

	// IMAGES - REG Expression: Test if the files are any of these
	else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
		fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
			response.writeHead(200, {'Content-Type': 'image/jpg'});
			response.end(data);
		})
	}

	// URL NOT FOUND
	else {
		response.writeHead(404, {'Content-Type': 'text/html'}); // 404 status code
		response.end('URL was not found');
	}


});

// Tell the server to look for a specific port
server.listen(1337, '127.0.0.1', () => {
	console.log('Listening(looking) for request.');
});

function replaceTemplate(originalHtml, laptop) {
	let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName); // Replace HTML data
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);
	return output;
}
