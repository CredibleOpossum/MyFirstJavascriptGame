
if (localStorage.game != undefined) {
	game = JSON.parse(localStorage.game)
	update()
	check()
} else {
	var game = {
		resources: {
			food: 0,
			wood: 0,
			availableHousing: 0,
			unassigned: 0
		},
		work: {
			farmers: 0,
			lumberjacks: 0
		},
		createable: [
			{
				amount: 0,
				name: "cot",
				foodCost: 0,
				woodCost: 10,
				housingBenefit: 1
			},
			{
				amount: 0,
				name: "House",
				foodCost: 0,
				woodCost: 20,
				housingBenefit: 3
			},
			{
				amount: 0,
				name: "Great house",
				foodCost: 0,
				woodCost: 30,
				housingBenefit: 5
			}
		]
	}
}

function update() {
	if (game.resources.availableHousing != 0 || (game.work.farmers + game.work.lumberjack) != 0) {
		document.getElementById("housingOptions").style.display = "block";
	}
	if (parseInt(document.getElementById("foodAmount").innerText.substring(6)) != game.resources.food) { // Calculates the current visual foodAmount, if changed, update.
		document.getElementById("foodAmount").innerText = "Food: " + game.resources.food;
		check();
	}
	if (parseInt(document.getElementById("woodAmount").innerText.substring(6)) != game.resources.wood) {
		document.getElementById("woodAmount").innerText = "Wood: " + game.resources.wood;
		check();
	}
	if (parseInt(document.getElementById("housingAmount").innerText.substring(17)) != game.resources.availableHousing) {
		document.getElementById("housingAmount").innerText = "Available Homes: " + game.resources.availableHousing;
		check();
	}
	if (parseInt(document.getElementById("Unassigned").innerText.substring(12)) != game.resources.unassigned) {
		document.getElementById("Unassigned").innerText = "Unassigned: " + game.resources.unassigned;
		check();
	}
	if (parseInt(document.getElementById("Farmers").innerText.substring(9)) != game.work.farmers) {
		document.getElementById("Farmers").innerText = "Farmers: " + game.work.farmers;
		check();
	}
	if (parseInt(document.getElementById("Lumberjacks").innerText.substring(13)) != game.work.lumberjacks) {
		document.getElementById("Lumberjacks").innerText = "Lumberjacks: " + game.work.lumberjacks;
		check();
	}
}

function check() {
	document.getElementById("expandable").innerHTML = "";
	document.getElementById("buyable").innerText = "";
	for (var loop = 0; loop < game.createable.length; loop++) { // Loops through all game.createables to find ones possible to create
		if (game.resources.food >= game.createable[loop].foodCost && game.resources.wood >= game.createable[loop].woodCost) {
			createcreateable(game.createable[loop].amount, game.createable[loop].name, loop, game.createable[loop].woodCost);
		}
	}
}

function collect(resource) {
	game.resources[resource]++; // Increments the collected resource
	update(); // Updates the visual value
}

function createVillager() {
	if (game.resources.availableHousing != 0) { // Only allow if avalable housing
		if (game.resources.food >= 10) { // Only allow if enough food
			game.resources.availableHousing -= 1; // Removes housing
			game.resources.food -= 10; // Removes food
			game.resources.unassigned++;
			update();
		}
	}
}

function assignFarmer() {
	if (game.resources.unassigned != 0) { // Only allow if theres not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.farmers++; // Increments the farmer game.worker
	}
	update();
}

function assignLumberjacks() {
	if (game.resources.unassigned != 0) { // Only allow if theres not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.lumberjacks++; // Increments the lumberjack game.worker
	}
	update();
}

function unassignFarmer() {
	if (game.work.farmers != 0) { // Only allow remove if theres game.workers to remove
		game.work.farmers--; // Removes a game.worker
		game.resources.unassigned++; // Increments the unassigned resource
	}
	update();
}

function unassignLumberjacks() {
	if (game.work.lumberjacks != 0) { // Only allow remove if theres game.workers to remove
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
	for (var loop = 0; loop < game.createable.length; loop++) { // Loops though all the house types and sums the possible housing to create the total housing
		houses += game.createable[loop].amount * game.createable[loop].housingBenefit;
	}
	game.resources.availableHousing = houses - (game.resources.unassigned + game.work.farmers + game.work.lumberjacks); // Calculates the avalable houses by removing the the game.workers from total housing
	update();
	check();
}

function createcreateable(amount, name, id, price) {
	document.getElementById("expandable").innerHTML += `<div>${amount}</div>`;
	document.getElementById("expandable").innerHTML += `<button onclick=create(${id})>Buy ${name} (${price} wood)</button><br>`;
	document.getElementById("expandable").innerHTML += `<br>`;
}

function doWork() {
	game.resources.food -= game.resources.unassigned; // Removes food for unassigned farmers
	game.resources.food -= game.work.lumberjacks * 3; // Removes 3 food per lumberjack
	game.resources.food += game.work.farmers; // Gives food for every farmer
	game.resources.wood += game.work.lumberjacks; // Gives wood for every lumberjack
}

function main() {
	doWork(); // Calculates gain/loss of game.resources
	update(); // Makes sure the visual values change
	save();
}

function save(){
	localStorage.setItem("game", JSON.stringify(game, null));
}

setInterval(main, 1000); // Calls "main" every secound

function toggleDarkMode() {
	var element = document.body;
  element.classList.toggle("dark-mode");
} 
