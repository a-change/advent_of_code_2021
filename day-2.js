const fs = require("fs");

start();

async function start() {
	
    const body = fs.readFileSync("./day-2-input.txt", {
		encoding: "utf8",
		flag: "r",
	});
    // const body = `forward 5
    // down 5
    // forward 8
    // up 3
    // down 8
    // forward 2`
	const array = body.split("\n");
    const result = findCoordinates(array, true);
	console.log(result);
}

function findCoordinates(array, includeAim) {
    let horizontal = 0, depth = 0, aim = 0;
    for (let item of array) {
        let splitItem = item.trim().split(" ");
        let direction = splitItem[0];
        let value = parseInt(splitItem[1]);
        switch (direction) {
            case "forward":
                horizontal += value;
                includeAim && (depth += (aim * value));
                console.log(`value: ${value}, depth: ${depth}, aim: ${aim}`)
                break;
            case "down":
                if (includeAim) {
                    aim += value;
                } else {
                    depth += value;
                }
                break;
            case "up":
                if (includeAim) {
                    aim -= value;
                } else {
                    depth -= value;
                }
                break;
        }
    }
    return {
        horizontal,
        depth,
        aim,
        product: horizontal * depth
    }
}