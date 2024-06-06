import { test, expect } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { normalizeURL, getURLsFromHTML } from './crawl.js';

// Test Suite for normalizeUrl
const targetURL = 'https://boot.dev/path';

test('passes a standard https url', () => {
	expect(normalizeURL('https://boot.dev/path')).toBe(targetURL);
});

test('passes an http url', () => {
	expect(normalizeURL('http://boot.dev/path')).toBe(targetURL);
});

test('passes a url with no separation between protocol and domain', () => {
	expect(normalizeURL('https:boot.dev/path')).toBe(targetURL);
});

test('passes a url without a protocol marker', () => {
	expect(normalizeURL('boot.dev/path')).toBe(targetURL);
});

test('passes a url with a leading "www." subdomain', () => {
	expect(normalizeURL('https://www.boot.dev/path')).toBe(targetURL)
});

test('passes a url with trailing slashes', () => {
	expect(normalizeURL('https://boot.dev/path///')).toBe(targetURL);
});


// Test Suite for getURLsFromHTML

const testHTML = `
	<html>
	    <body>
	    	<a href="/news/bootdev-beat-2024-05/"></a>
	        <a href="/news/bootdev-beat-2024-04/"></a>
		<a href="/news/bootdev-beat-2024-03/"></a>
		<a href="/news/bootdev-beat-2024-02/"></a>
		<a href="/news/bootdev-beat-2024-01/"></a>
	    </body>
	</html>
`;
const targetURLs = [
	"https://blog.boot.dev/news/bootdev-beat-2024-05/",
	"https://blog.boot.dev/news/bootdev-beat-2024-04/",
	"https://blog.boot.dev/news/bootdev-beat-2024-03/",
	"https://blog.boot.dev/news/bootdev-beat-2024-02/",
	"https://blog.boot.dev/news/bootdev-beat-2024-01/",
];

test('testing getURLsFromHTML', () => {
	expect(getURLsFromHTML(testHTML, normalizeURL('blog.boot.dev'))).toEqual(targetURLs)
});
