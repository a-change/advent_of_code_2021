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

function getMinMaxFromArrayOfObjects(arr, prop) {
	let min = arr[0][prop];
	let max = arr[0][prop];
	let i = arr.length;

	while (i--) {
		min = arr[i][prop] < min ? arr[i][prop] : min;
		max = arr[i][prop] > max ? arr[i][prop] : max;
	}
	return { min, max };
}

module.exports = { transposeArray, getMinMax, getMinMaxFromArrayOfObjects };