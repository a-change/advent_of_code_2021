function transposeArray(array) {
    const transposedArray = []
    array.forEach((item, i) => {
        for (let j = 0; j < item.length; j++) {
            let char = item[j];
            if (!transposedArray[j]) {
                transposedArray[j] = [];
            }
            transposedArray[j].push(char);
        }
        
    });
    return transposedArray;
}

function getMinMax(arr) {
	let min = arr[0];
	let max = arr[0];
	let i = arr.length;

	while (i--) {
		min = arr[i] < min ? arr[i] : min;
		max = arr[i] > max ? arr[i] : max;
	}
	return { min, max };
}


module.exports = { transposeArray, getMinMax };