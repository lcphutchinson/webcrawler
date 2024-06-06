import { crawlPage } from './crawl.js'
import { printReport } from './report.js'

function main(baseURL) {
	console.log(`Initiating at ${baseURL} \n`);
	crawlPage(baseURL).then(pages => printReport(pages));
}

if (process.argv.length != 3) 
	throw Error(`1 Positional Argument Expected. Received ${process.argv.length - 2}.`);
else main(process.argv[2]);
