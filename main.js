var resources = [0, 0, 0, 0]; // Resources, format [food, wood, avalableHousing unassigned]
var workers = [0, 0]; // The worker types, format [farmer, lumberjack]

var createable = [ // The craftables, format is [amountOwned, name, foodCost, woodCost, housingBenefit]
	[0, "cot", 0, 10, 1],
	[0, "bigger cot (yes i know, creative)", 0, 20, 3],
	[0, "even bigger cot", 0, 30, 5],
];

function update() {
	if (resources[2] != 0) {
		document.getElementById("housingOptions").style.display = "block";
	}
	if (parseInt(document.getElementById("foodAmount").innerText.substring(6)) != resources[0]) { // Calculates the current visual foodAmount, if changed, update.
		document.getElementById("foodAmount").innerText = "Food: " + resources[0];
		check();
	}
	if (parseInt(document.getElementById("woodAmount").innerText.substring(6)) != resources[1]) {
		document.getElementById("woodAmount").innerText = "Wood: " + resources[1];
		check();
	}
	if (parseInt(document.getElementById("housingAmount").innerText.substring(17)) != resources[2]) {
		document.getElementById("housingAmount").innerText = "Available Homes: " + resources[2];
		check();
	}
	if (parseInt(document.getElementById("Unassigned").innerText.substring(12)) != resources[3]) {
		document.getElementById("Unassigned").innerText = "Unassigned: " + resources[3];
		check();
	}
	if (parseInt(document.getElementById("Farmers").innerText.substring(9)) != workers[0]) {
		document.getElementById("Farmers").innerText = "Farmers: " + workers[0];
		check();
	}
	if (parseInt(document.getElementById("Lumberjacks").innerText.substring(13)) != workers[1]) {
		document.getElementById("Lumberjacks").innerText = "Lumberjacks: " + workers[1];
		check();
	}
}

function check() {
	document.getElementById("expandable").innerHTML = "";
	document.getElementById("buyable").innerText = "";
	for (var loop = 0; loop < createable.length; loop++) { // Loops through all createables to find ones possible to create
		if (resources[0] >= createable[loop][2] && resources[1] >= createable[loop][3]) {
			createCreateable(createable[loop][0], createable[loop][1], loop, createable[loop][3]);
		}
	}
}

function collect(index) {
	resources[index]++; // Increments the collected resource
	update(); // Updates the visual value
}

function createVillager() {
	if (resources[2] != 0) { // Only allow if avalable housing
		if (resources[0] >= 10) { // Only allow if enough food
			resources[2] -= 1; // Removes housing
			resources[0] -= 10; // Removes food
			resources[3]++;
			update();
		}
	}
}

function assignFarmer() {
	if (resources[3] != 0) { // Only allow if theres not 0 unassigned
		resources[3]--; // Removes an unassigned
		workers[0]++; // Increments the farmer worker
	}
	update();
}

function assignLumberjacks() {
	if (resources[3] != 0) { // Only allow if theres not 0 unassigned
		resources[3]--; // Removes an unassigned
		workers[1]++; // Increments the lumberjack worker
	}
	update();
}

function unassignFarmer() {
	if (workers[0] != 0) { // Only allow remove if theres workers to remove
		workers[0]--; // Removes a worker
		resources[3]++; // Increments the unassigned resource
	}
	update();
}

function unassignLumberjacks() {
	if (workers[1] != 0) { // Only allow remove if theres workers to remove
    workers[1]--; // Removes a worker
		resources[3]++; // Increments the unassigned resource
	}
	update();
}

function create(type) {
  resources[0] -= createable[type][2]; // Consumes the required resources
	resources[1] -= createable[type][3];
	createable[type][0] += 1; // Adds the selected craftable
	var houses = 0;
	for (var loop = 0; loop < createable.length; loop++) { // Loops though all the house types and sums the possible housing to create the total housing
		houses += createable[loop][0] * createable[loop][4];
	}
	resources[2] = houses - (resources[3] + workers[0] + workers[1]); // Calculates the avalable houses by removing the the workers from total housing
	update();
	check();
}

function createCreateable(amount, name, id, price) {
	document.getElementById("expandable").innerHTML += `<div>${amount}</div>`;
	document.getElementById("expandable").innerHTML += `<button onclick=create(${id})>Buy ${name} (${price} wood)</button><br>`;
	document.getElementById("expandable").innerHTML += `<br>`;
}

function work() {
	resources[0] -= resources[3]; // Removes food for unassigned farmers
	resources[0] -= workers[1] * 3; // Removes 3 food per lumberjack
	resources[0] += workers[0]; // Gives food for every farmer
	resources[1] += workers[1]; // Gives wood for every lumberjack
}

function main() {
	work(); // Calculates gain/loss of resources
	update(); // Makes sure the visual values change
}

setInterval(main, 1000); // Calls "main" every secound
