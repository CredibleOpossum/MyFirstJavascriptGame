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
		// Only allow if there's not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.farmers++; // Increments the farmer game.worker
	}
	update();
}

function assignLumberjacks() {
	if (game.resources.unassigned != 0) {
		// Only allow if there's not 0 unassigned
		game.resources.unassigned--; // Removes an unassigned
		game.work.lumberjacks++; // Increments the lumberjack game.worker
	}
	update();
}

function unassignFarmer() {
	if (game.work.farmers != 0) {
		// Only allow remove if there's game.workers to remove
		game.work.farmers--; // Removes a game.worker
		game.resources.unassigned++; // Increments the unassigned resource
	}
	update();
}

function unassignLumberjacks() {
	if (game.work.lumberjacks != 0) {
		// Only allow remove if there's game.workers to remove
		game.work.lumberjacks--; // Removes a game.worker
		game.resources.unassigned++; // Increments the unassigned resource
	}
	update();
}
