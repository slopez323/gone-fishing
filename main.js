const prompt = require("prompt-sync")();
const chalk = require("chalk");

let fishCount = 0;
let caughtFish = []; // keys: type, weight, value
let totalWeight = 0;
let totalValue = 0;
let time = 360;

console.log(chalk.blue(`
================================================

You've gone fishing! Try to maximize the value of your caught fish. You can fish
for ${chalk.underline('six hours (till 12:00pm)')} and can catch ${chalk.underline('at most 10 lbs')} of fish.`));
showSummary('6:00am', 'continue');

// randomly generated fish (2 descriptors + type)
function generateFish() {
    let firstDesc = ['Slippery', 'Scaly', 'Luminescent', 'Shiny', 'Golden', 'Smelly', 'Slimy', 'Foul-smelling', 'Water-dwelling', 'Iridescent'];
    let secondDesc = ['White-bellied', 'Finned', 'Bony', 'Beautiful', 'Poisonous', 'Flat', 'Slow-moving', 'Bright', 'Tiny', 'Fat'];
    let fishType = ['Marlin', 'Sailfish', 'Anchovy', 'Barracuda', 'Clownfish', 'Flounder', 'Puffer', 'Tuna', 'Lionfish', 'Catfish'];

    let i = Math.floor(Math.random() * 10);
    let j = Math.floor(Math.random() * 10);
    let k = Math.floor(Math.random() * 10);

    return `${firstDesc[i]} ${secondDesc[j]} ${fishType[k]}`;
}

// randomly generated weight (within 10 lbs)
function generateWeight() {
    let weight = +((Math.random() * 10).toFixed(2));
    return weight;
}

// randomly generated value (within $20)
function generateValue() {
    let value = +((Math.random() * 20).toFixed(2));
    return value;
}

// randomly generated time (15min to 1.5hrs)
function generateTime() {
    let duration = Math.floor(Math.random() * 76) + 15;
    return duration;
}



function showSummary(currentTime, status) {
    if (status === "done") {
        console.log(chalk.blue(`
================================================
`));
        console.log(`The time is ${chalk.bold(currentTime)}.  Time's up!
        
You caught ${chalk.bold(fishCount)} fish:`);
        for (let i = 0; i < caughtFish.length; i++) {
            console.log(chalk.green(`* ${caughtFish[i].type}, ${caughtFish[i].weight} lbs, $${caughtFish[i].value}`));
        }
        console.log(`
Total weight: ${chalk.green.bold(`${totalWeight.toFixed(2)} lbs`)}
Total value: ${chalk.green.bold(`$${totalValue.toFixed(2)}`)}
`);
        console.log(chalk.blue(`================================================`));
    } else {
        console.log(chalk.blue(`
================================================
`));
        console.log(`The time is ${chalk.bold(currentTime)}.  So far you've caught:
${chalk.bold(fishCount)} fish, ${chalk.bold(totalWeight.toFixed(2))} lbs, $${chalk.bold(totalValue.toFixed(2))}

`);
        catchFish();
    }
};

function catchFish() {
    let randomFish = generateFish();
    let randomWeight = generateWeight();
    let randomValue = generateValue();
    let randomDuration = generateTime();

    console.log(`After ${randomDuration} minutes, you caught a ${randomFish} weighing ${chalk.red.bold(`${randomWeight} lbs`)} and valued at ${chalk.red.bold(`$${randomValue}`)}
    
    `);

    if (totalWeight + randomWeight > 10) {
        console.log(`This fish would put you over 10 lbs, so you release it.
        `);
        prompt(`Press [enter] to continue.
> `);
        computeTime(randomDuration);
    } else {
        getAction(randomFish, randomWeight, randomValue, randomDuration);
    }
};

function getAction(randomFish, randomWeight, randomValue, randomDuration) {
    console.log(`Your action: [c]atch or [r]elease?`)
    let action = prompt(`> `)
    if (action === "c") {
        console.log(`
You chose to keep the fish.
`)
        addFish(randomFish, randomWeight, randomValue, randomDuration);
    } else if (action === "r") {
        console.log(`
You chose to release the fish.
`)
        computeTime(randomDuration);
    } else {
        getAction(randomFish, randomWeight, randomValue, randomDuration);
    }
};

function addFish(randomFish, randomWeight, randomValue, randomDuration) {
    let newFish = {}
    newFish.type = randomFish;
    newFish.weight = randomWeight;
    newFish.value = randomValue;

    caughtFish.push(newFish);
    fishCount++;
    totalWeight += randomWeight;
    totalValue += randomValue;

    computeTime(randomDuration);
};

function computeTime(duration) {
    time += duration;
    let hour = Math.floor(time / 60);
    let minute = Math.round((time / 60 - hour) * 60);

    if (String(minute).length < 2) {
        minute = `0${minute}`
    }

    if (hour >= 6 && hour < 12) {
        showSummary(`${hour}:${minute}am`, `continue`)
    } else {
        showSummary(`${hour}:${minute}pm`, `done`)
    }
};