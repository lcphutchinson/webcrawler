/**
 * Merges link log arrays in descending order of links values
 *
 * @param {Array}	lsA	First operand Array
 * @param {Array}	lsB	Second operand Array
 *
 * @return	A single array containing the elements of lsA and lsB in descending order
 */
const merge = (lsA, lsB) => {
	if(!lsA) return lsB;
	if(!lsB) return lsA;
	let ctA = 0, ctB = 0;
	let output = []
	while(ctA < lsA.length && ctB < lsB.length) {
		if(lsA[ctA][1].links >= lsB[ctB][1].links) {
			output.push(lsA[ctA]);			
			ctA++;
		}
		else {
			output.push(lsB[ctB]);
			ctB++;
		}
	}
	if(ctA < lsA.length) return output.concat(lsA.slice(ctA));
	if(ctB < lsB.length) return output.concat(lsB.slice(ctB));
	return output;
}

/**
 * Recursive MergeSort
 *
 * @param {Array}	ls	Link log Array for sorting
 *
 * @return	A descending order array of link log
 */
const mergeSort = (ls) => {
	const pivot = ls.length >> 1;
	const lsA = ls.slice(0, pivot);
	const lsB = ls.slice(pivot);
	if(lsA.length < 2 && lsB.length < 2) return merge(lsA, lsB);
	else if(lsA.length < 2) return merge(lsA, mergeSort(lsB));
	else if(lsB.length < 2) return merge(mergeSort(lsA), lsB);
	else return merge(mergeSort(lsA), mergeSort(lsB));
}	
	
const printReport = (pages) => {
	const sortedPages = mergeSort(Array.from(pages.entries()));
	console.log('\nPrinting Report: \n');
	sortedPages.forEach(elm => console.log(`Recorded ${elm[1].links} internal links to ${elm[0]}`)); 
}

export { printReport }
