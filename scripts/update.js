function update() {
	if (game.resources.availableHousing != 0 || game.work.farmers != 0 || game.work.lumberjacks != 0) {
		document.getElementById("housingOptions").style.display = "block";
	}
	perSecound = game.work.farmers - game.work.lumberjacks * 2 - game.resources.unassigned;
	document.getElementById("foodAmount").innerText = "Food: " + game.resources.food.toFixed(2) + ` (${perSecound}/s)`;
	perSecound = game.work.lumberjacks * 3;
	document.getElementById("woodAmount").innerText = "Wood: " + game.resources.wood.toFixed(2) + ` (${perSecound}/s)`;
	document.getElementById("housingAmount").innerText = "Available Homes: " + game.resources.availableHousing;
	document.getElementById("unassigned").innerText = "Unassigned: " + game.resources.unassigned;
	document.getElementById("farmers").innerText = "Farmers: " + game.work.farmers;
	document.getElementById("lumberjacks").innerText = "Lumberjacks: " + game.work.lumberjacks;
	check();
}
