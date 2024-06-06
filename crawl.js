import { JSDOM } from 'jsdom';

/**
 * Produces a normalizedd url string from a given url imput
 *
 * Allows for URL string comparisons across trivial distinctions such as http/https protocol calls, presence/absence of 
 * the 'www' subdomain, and presence/absence of a trailing slash.
 *
 * @param {String}	url	A url-formatted string
 *
 * @return {String}	A normalized form of the input url.
 */
const normalizeURL = (url) => {
	return url.replace(/^(https?:\/?\/?)?(www\.)?/, 'https://')
		.replace(/\/+$/, ''); 
}

/**
 * Parses a raw HTML block for anchors and returns their URLs as absolute URLs
 *
 * @param {String}	htmlBody	A block of HTML text
 * @param {String}	baseURL		The source URL for htmlBody
 *
 * @return {Array}	An Array of URL strings corresponding to anchors in the htmlBody
 */
const getURLsFromHTML = (htmlBody, baseURL) => {
	const anchors = Array.from(new JSDOM(htmlBody).window.document.querySelectorAll('a'));
	return anchors.map(anchor => (anchor.href.startsWith('/')) ? baseURL + anchor.href : anchor.href);
}

/**
 * Conducts a fetch at the provided URL and returns any html found there.
 *
 * @param {String}	url	the target URL
 *
 * @return {String}	An html block found at the target URL
 */
const pullHTML = async (url) => {
	const result = await fetch(url);
	if(!result.ok) throw Error(
		`invalid Response code`);
	if(!result.headers.get('content-type').includes('text/html')) throw Error(
		`incompatible content type`);
	if(!result.body) throw Error(
		`empty HTML body`);
	return await result.text();
}

/**
 * Recursively logs the internal links within a given web domain
 *
 * @param {String}	rootURL			The root webpage to crawl from
 * @patam {String}	currentURL = rootURL	Tracker for the current page
 * @param {Map}		pages = new Map()	Map object for storing link logs
 *
 * @return {Map}	A map of URL keys to links objects containing link counts
 */
const crawlPage = async (rootURL, currentURL = rootURL, pages = new Map()) => {
	if(!currentURL.includes(new URL(rootURL).hostname)) return pages;
	const normalURL = normalizeURL(currentURL);
	if(pages.has(normalURL)) {
		pages.get(normalURL).links++;
		return pages;
	}
	pages.set(normalURL,{ links: 1 });
	const newURLs = await pullHTML(normalURL)
		.then(result => getURLsFromHTML(result, rootURL))
		.catch(e => console.error(`Error "${e.message}" during pull from ${currentURL}`));
	if(newURLs) for(const url of newURLs) pages = await crawlPage(rootURL, url, pages);
	return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
