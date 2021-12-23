const { time } = require("console");
const { getMinMax, getMinMaxFromArrayOfObjects } = require("./helping-functions");
const fs = require("fs");

start();

async function start() {
	try {
		const testPlayers = [new Player(1, 4, 4, 0), new Player(2, 8, 8, 0)];
		const inputPlayers = [new Player(1, 8, 8, 0), new Player(2, 6, 6, 0)];
        const [r1, r2] = playersMoveDirac(8, 6, 0, 0, {});
        console.log(r1, r2)
		console.log(getMinMax([r1, r2]));
		return;
		const result = playerMoveDeterministic(testPlayers);
		console.log("final:\n", result);
		console.log("multiplication: ", result.timesRolled * result.maxScore.min);
	} catch (e) {
		console.log("the error", e);
	}
}

/* based on Jonathan Paulson's solution: https://www.youtube.com/watch?v=a6ZdJEntKkk */
function playersMoveDirac(p1, p2, s1, s2, results) {
    // console.log(`${p1}_${s1}_${p2}_${s2}`)
    if (s1 >= 21) {
        return [1, 0];
    }
    if (s2 >= 21) {
        return [0, 1];
    }
    if (`${p1}_${s1}_${p2}_${s2}` in results) {
        return results[`${p1}_${s1}_${p2}_${s2}`];
    }
    const answer = [0, 0];
	for (let d1 of [1, 2, 3]) {
		for (let d2 of [1, 2, 3]) {
			for (let d3 of [1, 2, 3]) {
				let rolledDice = d1 + d2 + d3;
                let sum = (p1 + rolledDice);
                
				let newP1 = sum > 10 ? sum % 10 : sum;
                let newS1 = s1 + newP1;
                let [x1, y1] = playersMoveDirac(p2, newP1, s2, newS1, results);
                answer[0] += y1;
                answer[1] += x1;
			}
		}
	}
    results[`${p1}_${s1}_${p2}_${s2}`] = answer;
    return answer;
}

function playerMoveDeterministic(players) {
	const rollsPerMove = 3;
	let lastDiceScore = 0;
	let timesRolled = 0;
	let maxScore = {
		max: 0,
		min: 0,
	};
	let step = 0;
	while (maxScore.max <= 1000) {
		step > 195 && step < 202 && console.log("step", step, "\n");
		for (let player of players) {
			let rolledDice = rollDeterministicDice(lastDiceScore, rollsPerMove);

			timesRolled += rollsPerMove;
			lastDiceScore = rolledDice.last;
			let sum = player.currentPosition + rolledDice.sumToMove;
			player.currentPosition = sum > 10 ? sum % 10 : sum;
			player.totalScore += player.currentPosition;

			console.log(` - Player ${player.index} rolls ${rolledDice.scores.join("+")} and moves to space ${player.currentPosition} for a total score of ${player.totalScore}.`);

			maxScore = getMinMaxFromArrayOfObjects(players, "totalScore");
			if (maxScore.max === 1000) {
				break;
			}
		}
		step++;

		step > 195 && step < 202 && console.log(players, maxScore, "\n");
		if (maxScore.max === 1000) {
			break;
		}
	}
	return {
		players,
		timesRolled,
		maxScore,
	};
}

function rollDeterministicDice(lastDiceScore, rolls) {
	const min = 0;
	const max = 100;
	const scores = [];

	for (let i = 1; i <= rolls; i++) {
		if (lastDiceScore >= max) {
			lastDiceScore = min;
		}
		let score = lastDiceScore + i;

		scores.push(score > 100 ? score - 100 : score);
	}
	const sum = scores.reduce((acc, curr) => acc + curr, 0);
	return {
		scores,
		last: scores[scores.length - 1],
		sum,
		sumToMove: sum % 10,
	};
}

function Player(index, startingPosition, currentPosition, score) {
	return {
		index,
		startingPosition,
		currentPosition,
		totalScore: 0,
		currentScore: 0,
		wins: 0,
	};
}
