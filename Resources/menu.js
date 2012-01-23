function createMenuOn(name, top){
	var btn = Ti.UI.createButton({
		backgroundImage: "menu_button/" + name + ".png",
		backgroundSelectedImage: "menu_button/" + name + "_selected.png",
		backgroundColor: 'transparent',
		height: 50,
		width: 242,
		right: 5,
		top: top
	});
	
	return btn;
}

function createMenuOff(name, top){
	var btn = Ti.UI.createButton({
		backgroundImage: "menu_button/" + name + "_off.png",
		backgroundSelectedImage: "menu_button/" + name + "_off.png",
		backgroundColor: 'transparent',
		height: 50,
		width: 242,
		right: 5,
		top: top
	});
	
	return btn;
}

function createTopMenu(name, top, count){
	if (count == 0){
		var btn = Ti.UI.createButton({
			backgroundImage: "menu_button/" + name + "_off.png",
			backgroundSelectedImage: "menu_button/" + name + "_off.png",
			backgroundColor: 'transparent',
			height: 50,
			width: 242,
			right: 5,
			top: top
		});
	
	 
	}else{
		var btn = Ti.UI.createButton({
			backgroundImage: "menu_button/" + name + ".png",
			backgroundSelectedImage: "menu_button/" + name + "_selected.png",
			backgroundColor: 'transparent',
			height: 50,
			width: 242,
			right: 5,
			top: top
		});
	}
	return btn;
}

function renderPath(path){
	path = path.replace("{home}/Documents", Titanium.Filesystem.resourcesDirectory)
	return path;
}