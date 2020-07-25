function update() {
	if (game.resources.availableHousing != 0 || game.work.farmers != 0 || game.work.lumberjacks != 0) {
		document.getElementById("housingOptions").style.display = "block"; // If any houses or people exist, show the menu
	}
	perSecound = game.work.farmers - game.work.lumberjacks * 2 - game.resources.unassigned; // Claculates the resources per secound
	document.getElementById("foodAmount").innerText = "Food: " + game.resources.food.toFixed(2) + ` (${perSecound}/s)`; // Builds the string to display
	perSecound = game.work.lumberjacks * 3;
	document.getElementById("woodAmount").innerText = "Wood: " + game.resources.wood.toFixed(2) + ` (${perSecound}/s)`; // Builds the string to display
	document.getElementById("housingAmount").innerText = "Available Homes: " + game.resources.availableHousing;
	document.getElementById("unassigned").innerText = "Unassigned: " + game.resources.unassigned;
	document.getElementById("farmers").innerText = "Farmers: " + game.work.farmers;
	document.getElementById("lumberjacks").innerText = "Lumberjacks: " + game.work.lumberjacks;
	check();
}

function check() {
	document.getElementById("expandable").innerHTML = "";
	document.getElementById("buyable").innerText = "";
	for (var item in game.createable) {
		// Displays the creatables to screen
		var createable = game.createable[item];
		if (game.resources.food >= createable.foodCost && game.resources.wood >= createable.woodCost) {
			createCreateable(createable);
		}
	}
}
