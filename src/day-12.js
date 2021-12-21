const { time } = require("console");
const fs = require("fs");

start();

async function start() {
	try {
		const body = fs.readFileSync("../data/day-12-input.txt", {
			encoding: "utf8",
			flag: "r",
		});

		// const body = `start-A
		// start-b
		// A-c
		// A-b
		// b-d
		// A-end
		// b-end`;
		const alternativeCaves = {};
		const names = [];
		const caves = body.split("\n").reduce((acc, curr, index, arr) => {
			// console.log(acc);
			let caves = curr.trim().split("-");
			for (let i = 0; i < caves.length; i++) {
				let cave = caves[i];
				if (!names.includes(cave)) {
					names.push(cave);
				}
				if (!acc[cave]) {
					acc[cave] = new AnotherCave(cave);
				}
				// console.log(acc);
				let connectedCave;
				if (i === 0) {
					connectedCave = caves[i + 1];
				} else if (i > 0) {
					connectedCave = caves[i - 1];
				}
				if (cave === "start") {
					!acc[cave].out.includes(connectedCave) && acc[cave].out.push(connectedCave);
				} else if (cave === "end") {
					!acc[cave].in.includes(connectedCave) && acc[cave].in.push(connectedCave);
				} else {
					!acc[cave].out.includes(connectedCave) && connectedCave !== "start" && acc[cave].out.push(connectedCave);
					!acc[cave].in.includes(connectedCave) && connectedCave !== "in" && acc[cave].in.push(connectedCave);
				}
			}
			return acc;
		}, {});
		console.log(names.sort());

		const paths = [];
        console.log(caves);
		// that's all... no magic, no bloated framework
		// taken from: https://stackoverflow.com/a/45628445/3555636
		for (var [key, value, path, parent] of traverseSmallCavesTwice(caves.start, caves)) {
			// do something here with each key and value
			paths.push(path);
		}
		const filteredPaths = paths.filter((path) => path[path.length - 1] === "end");
		console.log(filteredPaths.map(path => path.join(",")));
		// console.log(filteredPaths);
		console.log(filteredPaths.length);
	} catch (e) {
		console.log("the error", e);
	}
}

function runThroughCaves(caves) {
    const paths = [];
    for (let caveName of caves.start.out) {
        let path = ["start", caveName];
        let cave = caves[caveName];
        for (let connectedCave of cave.out) {

        }
    }
}

// https://stackoverflow.com/a/45628445/3555636
function* traverseSmallCavesTwice(o, caves, path = ["start"]) {
	for (var i of o.out) {
        console.log(`pathObj: ${path}, i: ${i}, count: ${JSON.stringify(countLowerCase(path))}`)

		if (i === i.toLowerCase() && i !== "start" && i !== "end" && isAnyLowerCasedLargerThanOne(path) && countLowerCase(path)[i] > 0) {
			continue;
		} 
		const itemPath = path.concat(i);
		yield [i, o[i], itemPath, o];
	}
	for (var i of o.out) {
		if (i === i.toLowerCase() && i !== "start" && i !== "end" && isAnyLowerCasedLargerThanOne(path) && countLowerCase(path)[i] > 0) {
			continue;
		} 
		const itemPath = path.concat(i);
		if (caves[i] !== null && typeof caves[i] == "object") {
			//going one step down in the object tree!!
			yield* traverseSmallCavesTwice(caves[i], caves, itemPath );
		}
	}
}

function countLowerCase(arr) {
    let lowerCased = {};
    for (let item of arr.filter(item => !["start", "end"].includes(item))) {
        if (!lowerCased[item]) {
            lowerCased[item] = 0;
        }
        lowerCased[item] += (item === item.toString().toLowerCase()) ? 1 : 0;
    }
    return lowerCased;
}

function isAnyLowerCasedLargerThanOne(arr) {
    const obj = countLowerCase(arr);
    let anyLarger = false;
    for (let i in obj) {
        if (obj[i] === 2) {
            anyLarger = true;
            break;
        }
    }
    return anyLarger;
}

// Implementation of Traverse (https://stackoverflow.com/a/45628445/3555636)
function* traverse(o, caves, path = []) {
    console.log("o", o)
	for (var i of o.out) {
		if (i === i.toLowerCase() && path.includes(i)) {
			continue;
		}
		const itemPath = path.concat(i);
		yield [i, o[i], itemPath, o];
	}
	for (var i of o.out) {
		if (i === i.toLowerCase() && path.includes(i)) {
			continue;
		}
		const itemPath = path.concat(i);
		if (caves[i] !== null && typeof caves[i] == "object") {
			//going one step down in the object tree!!
			yield* traverse(caves[i], caves, itemPath);
		}
	}
}

function traverse4(tree, current, path, parent) {
	//process current node here
	// console.log("current", current);
	// console.log(path)
	path.push(current.name);
	if (current.name === "end") {
		console.log(path);
		return path;
	}
	//visit children of current
	for (var cki in current.out) {
		var ck = current.out[cki];
		var child = tree[ck];
		// console.log("child", ck, child);
		child !== parent && traverse4(tree, child, path, ck);
	}
	return path;
}

function pathsFrom(vertex) {
	if (vertex.out.length === 0) return [[vertex]];
	var pathsOfEachChild = vertex.out.map(pathsFrom),
		flatListOfPaths = pathsOfEachChild.reduce(function (flat, branch) {
			return flat.concat(branch);
		}),
		withVertexPrepended = flatListOfPaths.map(function (path) {
			return [vertex].concat(path);
		});
	return withVertexPrepended;
}

function* traverse3(o) {
	const memory = new Set();
	function* innerTraversal(o, path = []) {
		if (memory.has(o)) {
			// we've seen this object before don't iterate it
			return;
		}
		// add the new object to our memory.
		memory.add(o);
		for (var i of Object.keys(o)) {
			console.log(i);
			const itemPath = path.concat(i);
			yield [i, o[i], itemPath, o];
			if (o[i] !== null && typeof o[i] == "object") {
				//going one step down in the object tree!!
				yield* innerTraversal(o[i], itemPath);
			}
		}
	}
	yield* innerTraversal(o);
}

function convertToTree(caves) {
	const tree = {
		start: {},
	};
	for (let connectedCave of caves.start.out) {
		tree.start[connectedCave] = {};
		// console.log(tree);

		treeize({
			tree: tree.start,
			start: connectedCave,
			caves: caves,
			root: tree,
			parent: "start",
			self: "start",
		});
	}

	return tree;
}

function treeize(params) {
	let { tree, start, caves, root, parent, self, endOnly, depth, shouldStopAfter } = params;
	const maxDepth = 1;
	for (let connectedCave of caves[start].out) {
		if (connectedCave === "start") {
			continue;
		}
		tree[start][connectedCave] = {};
		// console.log(`parent: ${parent}, connectedCave: ${connectedCave}, self: ${self}, depth: ${depth}`)
	}
	console.log("tree", tree);
	for (let connectedCave in tree[start]) {

		if (!endOnly && !shouldStopAfter && caves[parent].out.includes("end")) {
			console.log("has END");
			treeize({
				tree: tree[start],
				start: connectedCave,
				caves,
				root,
				parent: self,
				endOnly: true,
				depth: (depth || 0) + 1,
				self: connectedCave,
				shouldStopAfter: true,
			});
		} else if (!endOnly && !shouldStopAfter && (parent !== connectedCave || (parent === connectedCave && depth <= maxDepth))) {
			// console.log("what we pass:", tree[start], connectedCave, root)
			if (parent === connectedCave) {
				// console.dir(root, {
				//     depth: 15
				// })
				depth = (depth || 0) + 1;
				// console.log(`INSIDE: parent: ${parent}, connectedCave: ${connectedCave}, self: ${self}, depth: ${depth}, shouldStopAfter: ${depth === maxDepth}`);
			} else {
				depth = 0;
			}

			treeize({
				tree: tree[start],
				start: connectedCave,
				caves: caves,
				root: root,
				parent: self,
				self: connectedCave,
				depth: depth,
				shouldStopAfter: depth === maxDepth,
				endOnly: depth === maxDepth,
			});
		} else {
			tree[start][connectedCave] = {};
			for (let outCave of caves[connectedCave].out) {
				tree[start][connectedCave][outCave] = {};
			}
			// break;
		}
	}
}

function findPathAgain(caves, start, paths) {
	paths = paths || start.connectedCaves.map((cave) => [cave]);
	// for (let connectedCaveName of start.connectedCaves) {
	//     let connectedCave = caves[connectedCaveName];
	//     let path = [connectedCaveName];
	//     paths.push(path);
	// }
	const stringedPaths = [paths.map((path) => path.join())];
	for (let path of paths) {
		console.log(path);
		for (let caveName of path) {
			let cave = caves[caveName];
			for (let i = 0; i < cave.connectedCaves.length; i++) {
				let connectedCave = cave.connectedCaves[i];
				if (connectedCave === "start") {
					continue;
				}
				if (i === 0) {
					path.push(connectedCave);
				} else {
					var newPath = ["start", caveName, connectedCave];
					var stringedNewPath = newPath.join();
					paths.push(newPath);
					stringedPaths.push(stringedNewPath);
				}
				if (connectedCave === "end") {
					break;
				}
			}
			if (path.includes("end") || newPath.includes("end")) {
				break;
			}
		}

		// console.log(findPathAgain(caves, path, paths))
	}
	// console.log(paths)
	return paths;
}

function traverse2(current, name) {
	//process current node here
	console.log("visiting ", name);

	//visit children of current
	for (var ck in current) {
		var child = current[ck];
		traverse2(child, ck);
	}
}

function findPaths(caves, start, end) {
	const paths = [];

	// iterate through connected caves of the start node
	// should return a separate path per each connected cave
	paths.push(...findPath2(caves, start, ["start"]));

	// now iterate through the connected caves of the connected caves of the start node
	// it should update existing paths created at the previous step and it should also generate new paths
	console.log(paths);
	let i = 0;
	for (let path of paths) {
		for (let caveName of path) {
			console.log(path);
			if (caves[caveName]) {
				paths.push(findPath2(caves, caves[caveName], path));
				// console.log()
				// path.push();
			}
			if (path.includes("end")) {
				break;
			}
			i++;
			if (i > 0) {
				break;
			}
		}
	}
	console.log("paths:", paths);
	// for (let connectedCave of start.connectedCaves) {
	//     let path = [connectedCave];
	// 	path.push(...findPath2(caves, caves[connectedCave], path));
	//     paths.push(path);
	// }
	return paths;
}

function findPath2(caves, start, path) {
	const paths = [];
	let filteredCaves = start.connectedCaves.filter((cave) => cave !== "start");
	for (let i = 0; i < filteredCaves.length; i++) {
		console.log(`path: ${path}\n`);
		console.log(`connected caves: ${filteredCaves}\n`);
		let connectedCaveName = filteredCaves[i];
		let connectedCave = caves[connectedCaveName];
		if (i > 0) {
			path = findPath2(caves, connectedCave, path);
		}
		if (i === 0) {
			if (connectedCaveName !== path[path.length - 1] && ((connectedCave.isSmall && !path.includes(connectedCaveName)) || !connectedCave.isSmall)) {
				path.push(connectedCaveName);
			}
		}
		//
		// let path = [connectedCaveName];
		// if (connectedCaveName === "end") {
		// 	break;
		// }
		// paths.push(findPath2(caves, cave))
	}
	return path;
}

function findPath(path, caves, start, end) {
	for (let connectedCave of start.connectedCaves) {
		let cave = caves[connectedCave];
		if (cave.isSmall) {
			if (!path.includes(connectedCave)) {
				path.push(connectedCave);
			}
		} else {
			path.push(connectedCave);
		}
		break;
		// if (connectedCave === end.name) {
		// 	break;
		// }
	}
	// path.push(...findPath(path, caves,caves[path[path.length - 1]], end))

	return path;
}

function AnotherCave(cave) {
	return {
		name: cave,
		isSmall: cave === cave.toLowerCase(),
		in: [],
		out: [],
	};
}

function Cave(cave) {
	return {
		name: cave,
		isSmall: cave === cave.toLowerCase(),
		connectedCaves: [],
	};
}

function Path(path) {
	path = path.split("-");
	return {
		start: path[0],
		end: path[1],
		connectedCaves: [],
	};
}

function hasChildren(node) {
	return typeof node === "object" && typeof node.children !== "undefined" && node.children.length > 0;
}
