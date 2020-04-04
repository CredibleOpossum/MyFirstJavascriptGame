function toggleDarkMode() {
	var element = document.body;
	element.classList.toggle("dark-mode");
}

function reset() {
	localStorage.clear();
	location.reload();
}

function save() {
	localStorage.setItem("game", btoa(JSON.stringify(game)));
}

function main() {
	doWork(); // Calculates gain/loss of game.resources
	update(); // Makes sure the visual values change
	save();
}

var game = {
	resources: {
		food: 0,
		wood: 0,
		availableHousing: 0,
		unassigned: 0,
	},
	work: {
		farmers: 0,
		lumberjacks: 0,
	},
	createable: [
		{
			amount: 0,
			name: "Cot",
			foodCost: 0,
			woodCost: 10,
			housingBenefit: 1,
		},
		{
			amount: 0,
			name: "House",
			foodCost: 0,
			woodCost: 20,
			housingBenefit: 3,
		},
		{
			amount: 0,
			name: "Great house",
			foodCost: 0,
			woodCost: 30,
			housingBenefit: 5,
		},
	],
};

if (localStorage.game != undefined) {
	game = JSON.parse(atob(localStorage.game));
	update();
	check();
}

function check() {
	document.getElementById("expandable").innerHTML = "";
	document.getElementById("buyable").innerText = "";
	for (var item in game.createable) {
		var createable = game.createable[item];
		if (game.resources.food >= createable.foodCost && game.resources.wood >= createable.woodCost) {
			createCreateable(createable);
		}
	}
}

function collect(resource) {
	game.resources[resource]++; // Increments the collected resource
	update();
}

function create(type) {
	game.resources.food -= game.createable[type].foodCost; // Consumes the required game.resources
	game.resources.wood -= game.createable[type].woodCost;
	game.createable[type].amount += 1; // Adds the selected craftable
	var houses = 0;
	for (var loop = 0; loop < game.createable.length; loop++) {
		// Loops though all the house types and sums the possible housing to create the total housing
		houses += game.createable[loop].amount * game.createable[loop].housingBenefit;
	}
	game.resources.availableHousing = houses - (game.resources.unassigned + game.work.farmers + game.work.lumberjacks); // Calculates the avalable houses by removing the the game.workers from total housing
	game.createable[type].foodCost *= 1.1;
	game.createable[type].woodCost *= 1.1;
	update();
	check();
}

function createCreateable(createable, id) {
	document.getElementById("expandable").innerHTML += `<div>${createable.amount}</div>`;
	costString = "(";
	if (createable.foodCost != 0) {
		costString += createable.foodCost.toFixed(2) + " food ";
	}
	if (createable.woodCost != 0) {
		costString += createable.woodCost.toFixed(2) + " wood";
	}
	costString += ")";
	document.getElementById("expandable").innerHTML += `<button onclick=create(${game.createable.indexOf(createable)})>Buy ${createable.name} ${costString}</button><br>`;
	document.getElementById("expandable").innerHTML += `<br>`;
}

function doWork() {
	game.resources.food -= game.resources.unassigned; // Removes food for unassigned farmers
	game.resources.food -= game.work.lumberjacks * 2; // Removes 3 food per lumberjack
	game.resources.food += game.work.farmers; // Gives food for every farmer
	game.resources.wood += game.work.lumberjacks; // Gives wood for every lumberjack
}

setInterval(main, 1000); // Calls "main" every secound
