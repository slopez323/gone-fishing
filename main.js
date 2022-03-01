const prompt = require("prompt-sync")();
const chalk = require("chalk");

let fishCount = 0;
let caughtFish = []; // keys: type, weight, value
let totalWeight = 0;
let totalValue = 0;
let time = 360;
let durationMultiplier = 1

console.log(chalk.blue(`
================================================

You've gone fishing! Try to maximize the value of your caught fish. You can fish
for ${chalk.underline('six hours (till 12:00pm)')} and can catch ${chalk.underline('at most 10 lbs')} of fish.`));
goFishing('6:00am');

// randomly generated fish (2 descriptors + type)
function generateFish() {
    let firstDesc = ['Slippery', 'Scaly', 'Luminescent', 'Shiny', 'Golden', 'Smelly', 'Slimy', 'Foul-smelling', 'Water-dwelling', 'Iridescent'];
    let secondDesc = ['White-bellied', 'Finned', 'Bony', 'Beautiful', 'Poisonous', 'Flat', 'Slow-moving', 'Bright', 'Tiny', 'Fat'];
    let fishType = ['Marlin', 'Sailfish', 'Anchovy', 'Barracuda', 'Clownfish', 'Flounder', 'Puffer', 'Tuna', 'Lionfish', 'Catfish'];

    let i = Math.floor(Math.random() * 10);
    let j = Math.floor(Math.random() * 10);
    let k = Math.floor(Math.random() * 10);

    let fish = `${firstDesc[i]} ${secondDesc[j]} ${fishType[k]}`;

    let special = getSpecialFish({ 'Random': 0.8, 'Golden Doubloon': 0.1, 'Valueless Boot': 0.1 });

    if (special === 'Random') {
        return fish
    } else return special
};

// randomly generated weight (within 10 lbs)
function generateWeight() {
    let weight = +((Math.random() * 10).toFixed(2));
    return weight;
};

// randomly generated value (within $20)
function generateValue(fish) {
    if (fish === 'Golden Doubloon') {
        return 50;
    } else if (fish === 'Valueless Boot') {
        return 0;
    } else {
        let value = +((Math.random() * 20).toFixed(2));
        return value;
    }
};

// randomly generated time (15min to 1.5hrs)
function generateTime() {
    let duration = (Math.floor(Math.random() * 76) + 15) * durationMultiplier;
    return Math.floor(duration);
}



function showFinal(currentTime) {
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
}

function goFishing(currentTime) {
    console.log(chalk.blue(`
================================================
`));
    console.log(`The time is ${chalk.bold(currentTime)}.  So far you've caught:
${chalk.bold(fishCount)} fish, ${chalk.bold(totalWeight.toFixed(2))} lbs, $${chalk.bold(totalValue.toFixed(2))}

`);
    if (time + 30 < 720) {
        console.log(`What would you like to do: 
[1]chum the water with bait for 30 minutes to increase speed of catching fish
[2]proceed with catching fish
[3]release previously caught fish`);
        let act = prompt(`> `);
        if (act === '1' || act === '2' || act === '3') {
            chumOrCatch(act)
        } else {
            goFishing(currentTime)
        };
    } else catchFish();
};

function catchFish() {
    console.log(chalk.red.bold(`
You're fishing...`))
    let randomFish = generateFish();
    let randomWeight = generateWeight();
    let randomValue = generateValue(randomFish);
    let randomDuration = generateTime();

    if (time + randomDuration > 720) {
        console.log(chalk.blue.bold(`You ran out of time.`))
        showFinal(`12:00pm`)
    } else {
        console.log(`
After ${randomDuration} minutes, you caught a ${randomFish} weighing ${chalk.red.bold(`${randomWeight} lbs`)} and valued at ${chalk.red.bold(`$${randomValue}`)}
    
    `);

        if (totalWeight + randomWeight > 10) {
            console.log(chalk.blue.bold(`This fish would put you over 10 lbs, so you release it.
        `));
            prompt(`Press [enter] to continue.
> `);
            computeTime(randomDuration);
        } else {
            getAction(randomFish, randomWeight, randomValue, randomDuration);
        }
    }
};

function getAction(randomFish, randomWeight, randomValue, randomDuration) {
    console.log(`Your action: [c]atch or [r]elease?`)
    let action = prompt(`> `)
    if (action === "c") {
        console.log(chalk.blue.bold(`
You chose to keep the fish.
`))
        addFish(randomFish, randomWeight, randomValue, randomDuration);
    } else if (action === "r") {
        console.log(chalk.blue.bold(`
You chose to release the fish.
`))
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

    // if (hour >= 6 && hour < 12) {
    goFishing(`${hour}:${minute}am`)
    // } else {
    //     showFinal(`${hour}:${minute}pm`)
    // }
};

function getSpecialFish(obj) {
    let i
    let sum = 0
    let r = Math.random()

    for (i in obj) {
        sum += obj[i]
        if (r <= sum) return i
    }
};

function chumOrCatch(act) {
    if (act === '1') {
        durationMultiplier *= 0.9;
        time += 30;
        console.log(chalk.blue.bold(`
You chummed the water for 30 minutes and increased the speed of catching fish by 10%.
`));
        catchFish();
    } else if (act === '2') {
        catchFish();
    } else {
        if (caughtFish.length === 0) {
            console.log(chalk.blue.bold(`
You currently don't have any fish.`));
            computeTime(0);
        } else {
            console.log(`
You currently have the following: 
`);
            for (let i = 0; i < caughtFish.length; i++) {
                console.log(`[${i + 1}] ${caughtFish[i].type}, ${caughtFish[i].weight} lbs, $${caughtFish[i].value}`);
            };
            let release
            do {
                console.log(`
Which fish would you like to release? Enter ${caughtFish.length + 1} if you would like to cancel.`);
                release = +prompt(`> `);
            } while (!(release >= 1 && release <= caughtFish.length + 1));
            releaseFish(release);
        };
    };
};

function releaseFish(num) {
    if (num === caughtFish.length + 1) {
        computeTime(0);
    } else {
        fishCount--
        totalWeight -= caughtFish[num-1].weight
        totalValue -= caughtFish[num-1].value
        caughtFish.splice(num - 1, 1);
        computeTime(0);
    };
}