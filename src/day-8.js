const { time } = require("console");
const fs = require("fs");

start();

async function start() {
	const body = fs.readFileSync("../data/day-8-input.txt", {
		encoding: "utf8",
		flag: "r",
	});

	// const body = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
    // edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
    // fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
    // fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
    // aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
    // fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
    // dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
    // bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
    // egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
    // gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

	let array = body.split("\n").map((item) => {
		item = item.trim().split("|");
		return new Signal(item);
	});

    array = findAllNumbers(array);
    const sum = array.reduce((acc, prev) => acc + parseInt(prev.finalNumber), 0);
    console.log("sum is:", sum);
}

function findAllNumbers(array) {
    for (let element of array) {
		element.numbers = findNumbers(element.signals);
        for (let outputValue of element.output) {
            element.finalNumber = element.finalNumber + element.numbers.signalsToNumbers[outputValue];
        }
        element.finalNumber = parseInt(element.finalNumber);
	}
    return array
}

function findUniqueCombinations(array) {
	let unique = [];
	const uniqueOutputs = [2, 3, 4, 7];
	for (let element of array) {
		for (let entry of element.output) {
			if (uniqueOutputs.includes(entry.length)) {
				unique.push(entry);
			}
		}
	}
	return unique;
}

function Signal(item) {
	return {
		signals: item[0].trim().split(" ").map(signal => {
            return signal.split("").sort().join("");
        }),
		output: item[1].trim().split(" ").map(outputValue => {
            return outputValue.split("").sort().join("");
        }),
        finalNumber: ""
	};
}

function findNumbers(signals) {
	const signalsToNumbers = {};
	const numbersToSignals = {};
	const unclaimedSignals = [];
    let regexp, filteredSignal;
	for (let signal of signals.sort((a, b) => a.length - b.length)) {
		switch (signal.length) {
			case 2:
				signalsToNumbers[signal] = 1;
				numbersToSignals[1] = signal;
				break;
			case 3:
				signalsToNumbers[signal] = 7;
				numbersToSignals[7] = signal;
				break;
			case 4:
				signalsToNumbers[signal] = 4;
				numbersToSignals[4] = signal;
				break;
			case 7:
				signalsToNumbers[signal] = 8;
				numbersToSignals[8] = signal;
				break;
			default:
				unclaimedSignals.push(signal);
		}
	}
	for (let unclaimedSignal of unclaimedSignals) {
		switch (unclaimedSignal.length) {
			case 5:
                regexp = new RegExp(`[${numbersToSignals[1]}]`, "g");
                let matched = unclaimedSignal.match(regexp);
				if (matched && matched.length === 2) {
					numbersToSignals[3] = unclaimedSignal;
					signalsToNumbers[unclaimedSignal] = 3;
				} else {
					regexp = new RegExp(`[${numbersToSignals[4]}${numbersToSignals[7]}]`, "g");
					filteredSignal = unclaimedSignal.replace(regexp, "");
					if (filteredSignal.length === 1) {
						numbersToSignals[5] = unclaimedSignal;
						signalsToNumbers[unclaimedSignal] = 5;
					} else if (filteredSignal.length === 2) {
						numbersToSignals[2] = unclaimedSignal;
						signalsToNumbers[unclaimedSignal] = 2;
					}
				}
				break;
			case 6:
				regexp = new RegExp(`[${numbersToSignals[7]}]`, "g");
				filteredSignal = unclaimedSignal.replace(regexp, "");
				if (filteredSignal.length === 4) {
					numbersToSignals[6] = unclaimedSignal;
					signalsToNumbers[unclaimedSignal] = 6;
				} else {
					regexp = new RegExp(`[${numbersToSignals[4]}]`, "g");
				    filteredSignal = unclaimedSignal.replace(regexp, "");
                    console.log("now it's 0 or 9:", filteredSignal)
                    if (filteredSignal.length === 2) {
                        numbersToSignals[9] = unclaimedSignal;
                        signalsToNumbers[unclaimedSignal] = 9;
                    } else if (filteredSignal.length === 3) {
                        numbersToSignals[0] = unclaimedSignal;
                        signalsToNumbers[unclaimedSignal] = 0;
                    }
				}
                break;
		}
	}
    return {
        signalsToNumbers,
        numbersToSignals
    }
}
