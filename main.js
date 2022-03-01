const prompt = require("prompt-sync")();

//variables
let fishCount = 0;
let caughtFish = []; // keys: type, weight, value
let totalWeight = 0;
let totalValue = 0;
let time = 6;

console.log(`
================================================

You've gone fishing! Try to maximize the value of your caught fish. You can fish
for six hours (till 12:00pm) and can catch at most 10 lbs of fish.`);
showSummary();

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


// display time (1hr in between each catch, max 6 hrs)
// count caught fish
// sum weight and value of caught fish
// prompt for catch / release



function showSummary() {
    if (time === 12) {
        console.log(`
================================================

The time is 12:00pm.  Time's up!
        
You caught ${fishCount} fish:`);
        for (let i = 0; i < caughtFish.length; i++) {
            console.log(`* ${caughtFish[i].type}, ${caughtFish[i].weight} lbs, $${caughtFish[i].value}`);
        }
        console.log(`
Total weight: ${totalWeight.toFixed(2)} lbs
Total value: $${totalValue.toFixed(2)}

================================================`);
    } else {
        console.log(`
================================================
        
The time is ${time}:00am.  So far you've caught:
${fishCount} fish, ${totalWeight.toFixed(2)} lbs, $${totalValue.toFixed(2)}

`);

        time++;

        catchFish();
    }
}

function catchFish() {
    let randomFish = generateFish();
    let randomWeight = generateWeight();
    let randomValue = generateValue();

    console.log(`You caught a ${randomFish} weighing ${randomWeight} lbs and valued at $${randomValue}
    
    `);

    if (totalWeight + randomWeight > 10) {
        console.log(`This fish would put you over 10 lbs, so you release it.
        `);
        prompt(`Press [enter] to continue.
> `);
        showSummary();
    } else {
        getAction(randomFish, randomWeight, randomValue);
    }
}

function getAction(randomFish, randomWeight, randomValue) {
    console.log(`Your action: [c]atch or [r]elease?`)
    let action = prompt(`> `)
    if (action === "c") {
        console.log(`
You chose to keep the fish.
`)
        addFish(randomFish, randomWeight, randomValue);
    } else if (action === "r") {
        console.log(`
You chose to release the fish.
`)
        showSummary();
    } else {
        getAction(randomFish, randomWeight, randomValue);
    }
}

function addFish(randomFish, randomWeight, randomValue) {
    let newFish = {}
    newFish.type = randomFish;
    newFish.weight = randomWeight;
    newFish.value = randomValue;

    caughtFish.push(newFish);
    fishCount++;
    totalWeight += randomWeight;
    totalValue += randomValue;

    showSummary();
}