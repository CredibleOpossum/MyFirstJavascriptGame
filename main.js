function reset() {
	localStorage.clear();
	location.reload();
}

var previousValues = {
	foodAmount: 0,
	woodAmount: 0,
	housingAmount: 0,
	unassigned: 0,
	farmers: 0,
	lumberjacks: 0,
};

if (localStorage.game != undefined) {
	game = JSON.parse(localStorage.game);
	update();
	check();
} else {
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
				name: "cot",
				foodCost: 0,
				woodCost: 10,
				housingBenefit: 1,
			},
			{
				amount: 0,
				name: "House",
				foodCost: 10,
				woodCost: 20,
				housingBenefit: 3,
			},
			{
				amount: 0,
				name: "Great house",
				foodCost: 15,
				woodCost: 30,
				housingBenefit: 5,
			},
		],
	};
}

function update() {
	if (game.resources.availableHousing != 0 || game.work.farmers != 0 || game.work.lumberjacks != 0) {
		// Only update when the value actually changed
		document.getElementById("housingOptions").style.display = "block";
	}
	if (previousValues.foodAmount != game.resources.food) {
		previousValues.foodAmount = game.resources.food;
		perSecound = game.work.farmers - game.work.lumberjacks * 3 - game.resources.unassigned;
		document.getElementById("foodAmount").innerText = "Food: " + game.resources.food.toFixed(2) + ` (${perSecound}/s)`;
		check();
	}
	if (previousValues.woodAmount != game.resources.wood) {
		previousValues.woodAmount = game.resources.food;
		perSecound = game.work.lumberjacks * 3;
		document.getElementById("woodAmount").innerText = "Wood: " + game.resources.wood.toFixed(2) + ` (${perSecound}/s)`;
		check();
	}
	if (previousValues.housingAmount != game.resources.availableHousing) {
		previousValues.housingAmount = game.resources.availableHousing;
		document.getElementById("housingAmount").innerText = "Available Homes: " + game.resources.availableHousing;
		check();
	}
	if (previousValues.unassigned != game.resources.unassigned) {
		previousValues.unassigned = game.resources.unassigned;
		document.getElementById("unassigned").innerText = "Unassigned: " + game.resources.unassigned;
		check();
	}
	if (previousValues.farmers != game.work.farmers) {
		previousValues.farmers = game.work.farmers;
		document.getElementById("farmers").innerText = "Farmers: " + game.work.farmers;
		check();
	}
	if (previousValues.lumberjacks != game.work.lumberjacks) {
		previousValues.lumberjacks = game.work.lumberjacks;
		document.getElementById("lumberjacks").innerText = "Lumberjacks: " + game.work.lumberjacks;
		check();
	}
}

function check() {
	document.getElementById("expandable").innerHTML = "";
	document.getElementById("buyable").innerText = "";
	for (var loop = 0; loop < game.createable.length; loop++) {
		// Loops through all game.createables to find ones possible to create
		if (game.resources.food >= game.createable[loop].foodCost && game.resources.wood >= game.createable[loop].woodCost) {
			createcreateable(game.createable[loop].amount, game.createable[loop].name, loop, game.createable[loop].foodCost, game.createable[loop].woodCost);
		}
	}
}

function collect(resource) {
	game.resources[resource]++; // Increments the collected resource
	update(); // Updates the visual value
}

function createVillager() {
	if (game.resources.availableHousing != 0) {
		// Only allow if avalable housing
		if (game.resources.food >= 10) {
			// Only allow if enough food
			game.resources.availableHousing -= 1; // Removes housing
			game.resources.food -= 10; // Removes food
			game.resources.unassigned++;
			update();
		}
	}
}

function assignFarmer() {
	if (game.resources.unassigned != 0) {
		// Only allow if theres not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.farmers++; // Increments the farmer game.worker
	}
	update();
}

function assignLumberjacks() {
	if (game.resources.unassigned != 0) {
		// Only allow if theres not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.lumberjacks++; // Increments the lumberjack game.worker
	}
	update();
}

function unassignFarmer() {
	if (game.work.farmers != 0) {
		// Only allow remove if theres game.workers to remove
		game.work.farmers--; // Removes a game.worker
		game.resources.unassigned++; // Increments the unassigned resource
	}
	update();
}

function unassignLumberjacks() {
	if (game.work.lumberjacks != 0) {
		// Only allow remove if theres game.workers to remove
		game.work.lumberjacks--; // Removes a game.worker
		game.resources.unassigned++; // Increments the unassigned resource
	}
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

function createcreateable(amount, name, id, foodCost, woodCost) {
	document.getElementById("expandable").innerHTML += `<div>${amount}</div>`;
	costString = "(";
	if (foodCost != 0) {
		costString += foodCost.toFixed(2) + " food ";
	}
	if (woodCost != 0) {
		costString += woodCost.toFixed(2) + " wood";
	}
	costString += ")";
	document.getElementById("expandable").innerHTML += `<button onclick=create(${id})>Buy ${name} ${costString}</button><br>`;
	document.getElementById("expandable").innerHTML += `<br>`;
}

function doWork() {
	game.resources.food -= game.resources.unassigned; // Removes food for unassigned farmers
	game.resources.food -= game.work.lumberjacks * 3; // Removes 3 food per lumberjack
	game.resources.food += game.work.farmers; // Gives food for every farmer
	game.resources.wood += game.work.lumberjacks; // Gives wood for every lumberjack
}

function toggleDarkMode() {
	var element = document.body;
	element.classList.toggle("dark-mode");
}

function main() {
	doWork(); // Calculates gain/loss of game.resources
	update(); // Makes sure the visual values change
	save();
}

function save() {
	localStorage.setItem("game", JSON.stringify(game, null));
}

setInterval(main, 1000); // Calls "main" every secound
