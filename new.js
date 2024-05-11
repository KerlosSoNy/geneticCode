// Genetic Algorithm Parameters
const POPULATION_SIZE = 100;
const NUM_DAYS = 5;
const NUM_SHIFTS_PER_DAY = 2;
const MUTATION_RATE = 0.01;

// Example data of doctors' availability
const doctorsAvailability = {
    "Ahmed": [[1, 1, 0, 1, 0], [0, 1, 1, 0, 1]],
    "Doctor2": [[1, 0, 1, 0, 1], [1, 1, 0, 1, 0]],
    "Doctor3": [[0, 1, 0, 1, 1], [1, 0, 1, 0, 1]],
    // Add more doctors' availability as needed
};

// Generate random initial population
function generateInitialPopulation() {
    let population = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let schedule = {};
        for (let doctor in doctorsAvailability) {
            schedule[doctor] = Array.from({ length: NUM_DAYS }, () =>
                Array.from({ length: NUM_SHIFTS_PER_DAY }, () => Math.round(Math.random())));
        }
        population.push(schedule);
    }
    return population;
}

// Calculate fitness of each schedule
function calculateFitness(schedule) {
    let totalFitness = 0;
    for (let doctor in doctorsAvailability) {
        let fitness = 0;
        for (let day = 0; day < NUM_DAYS; day++) {
            for (let shift = 0; shift < NUM_SHIFTS_PER_DAY; shift++) {
                if (doctorsAvailability[doctor][shift][day] === schedule[doctor][day][shift]) {
                    fitness++;
                }
            }
        }
        totalFitness += fitness / (NUM_DAYS * NUM_SHIFTS_PER_DAY);
    }
    return totalFitness / Object.keys(doctorsAvailability).length;
}

// Perform crossover between two schedules
function crossover(parent1, parent2) {
    let child = {};
    for (let doctor in doctorsAvailability) {
        let childSchedule = [];
        for (let day = 0; day < NUM_DAYS; day++) {
            let childShift = [];
            for (let shift = 0; shift < NUM_SHIFTS_PER_DAY; shift++) {
                childShift.push(Math.random() < 0.5 ? parent1[doctor][day][shift] : parent2[doctor][day][shift]);
            }
            childSchedule.push(childShift);
        }
        child[doctor] = childSchedule;
    }
    return child;
}

// Perform mutation on a schedule
function mutate(schedule) {
    for (let doctor in doctorsAvailability) {
        for (let day = 0; day < NUM_DAYS; day++) {
            for (let shift = 0; shift < NUM_SHIFTS_PER_DAY; shift++) {
                if (Math.random() < MUTATION_RATE) {
                    schedule[doctor][day][shift] = 1 - schedule[doctor][day][shift];
                }
            }
        }
    }
}

// Select parents based on roulette wheel selection
function selectParents(population) {
    let fitnessSum = population.reduce((sum, schedule) => sum + calculateFitness(schedule), 0);
    let randNum = Math.random() * fitnessSum;
    let runningSum = 0;
    for (let schedule of population) {
        runningSum += calculateFitness(schedule);
        if (runningSum >= randNum) {
            return schedule;
        }
    }
    return population[population.length - 1];
}

// Main genetic algorithm function
function geneticAlgorithm() {
    let population = generateInitialPopulation();
    for (let i = 0; i < 100; i++) { // Number of generations
        let newPopulation = [];
        for (let j = 0; j < POPULATION_SIZE; j++) {
            let parent1 = selectParents(population);
            let parent2 = selectParents(population);
            let child = crossover(parent1, parent2);
            mutate(child);
            newPopulation.push(child);
        }
        population = newPopulation;
    }
    let bestSchedule = population.reduce((maxSchedule, schedule) => calculateFitness(schedule) > calculateFitness(maxSchedule) ? schedule : maxSchedule);
    return bestSchedule;
}

// Main function to run the genetic algorithm
function main() {
    let bestSchedule = geneticAlgorithm();
    console.log("Best Schedule:");
    for (let doctor in bestSchedule) {
        console.log(doctor + ":");
        for (let day = 0; day < NUM_DAYS; day++) {
            for (let shift = 0; shift < NUM_SHIFTS_PER_DAY; shift++) {
                console.log("Day", day + 1, "Shift", shift + 1, ":", bestSchedule[doctor][day][shift] ? "Available" : "Not Available");
            }
        }
    }
    console.log("Fitness:", calculateFitness(bestSchedule));
}

main();
