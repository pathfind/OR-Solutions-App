var modalSection = Ti.UI.currentWindow;

var sectionName = modalSection.sectionName;
var folder = modalSection.folder;
var mainBG = modalSection.mainBG;
var darkBG = modalSection.darkBG;
var lightBG = modalSection.lightBG;

Ti.include("menu.js");

var btnMainMenu = Titanium.UI.createButton({
        title: "Main Menu"
});

btnMainMenu.addEventListener('click',function()
{
        modalSection.close();
       
});



var modalWin = Ti.UI.createWindow({
	orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
        backgroundImage: mainBG,
        barColor: 'black',
       // title: sectionName,
	navBarHidden:false,
	leftNavButton: ((Titanium.Platform.model == 'Simulator') ? btnMainMenu : null)
});


var mem = Ti.UI.createLabel({
    text: "",
    color: 'white',
    backgroundColor: 'transparent',
    height: 60,
    width: 530,
    left: 5,
    bottom: 5
})
modalWin.add(mem);


   modalWin.addEventListener('focus', function(){
       //mem.text = Titanium.Platform.availableMemory;
   })

var navMain = Ti.UI.iPhone.createNavigationGroup({
	window:modalWin
});
//alert(modalSection.id);

var explore;
var visualize;
var interact;
var educate;
var evaluate;

	
explore = modalSection.db.execute('SELECT * FROM `explore` WHERE sectionID=' + modalSection.id);	
visualize = modalSection.db.execute('SELECT * FROM `visualize` WHERE sectionID=' + modalSection.id);
interact = modalSection.db.execute('SELECT * FROM `interact` WHERE isInternal=0 AND sectionID=' + modalSection.id);
interactInternal = modalSection.db.execute('SELECT * FROM `interact` WHERE isInternal=1 AND sectionID=' + modalSection.id);
educate = modalSection.db.execute('SELECT * FROM `educate` WHERE sectionID=' + modalSection.id);
evaluate = modalSection.db.execute('SELECT * FROM `evaluate` WHERE sectionID=' + modalSection.id);


var btnExplore = createTopMenu("explore", 403, explore.getRowCount()); 
modalWin.add(btnExplore);

var btnVisualize = createTopMenu("visualize", 466, visualize.getRowCount()); 
modalWin.add(btnVisualize);

var btnInteract = createTopMenu("interact", 529, interact.getRowCount() + interactInternal.getRowCount());
modalWin.add(btnInteract);

var btnEdu = createTopMenu("educate", 592, educate.getRowCount()); 
modalWin.add(btnEdu);

var btnEval= createTopMenu("evaluate", 655, evaluate.getRowCount());
modalWin.add(btnEval);

btnExplore.addEventListener('click',function()
{
	//alert(explore);
	if (explore.getRowCount() == 0) return;
	var winExplore = Ti.UI.createWindow({
		//title: "Explore (" + sectionName + ")",
		rightNavButton: btnMainMenu,
                backgroundImage: darkBG,
                orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
                barColor: 'black',
                url: "explore.js",
		navBarHidden:false
	});
        
        winExplore.nav = navMain;
        winExplore.parentModal = modalSection;
	winExplore.db = modalSection.db;
	winExplore.products = explore;
	winExplore.folder = folder;
	winExplore.lightBG = lightBG;
	
	winExplore.addEventListener('close', function(){
		explore = modalSection.db.execute('SELECT * FROM `explore` WHERE sectionID=' + modalSection.id);
	})
	
	navMain.open(winExplore);
});

btnVisualize.addEventListener('click', function(){
	if (visualize.getRowCount() == 0) return;
	var winVisualize = Ti.UI.createWindow({
		//title: "Visualize (" + sectionName + ")",
		rightNavButton: btnMainMenu,
                backgroundImage: darkBG,
                orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
               barColor: 'black',
                url: "visualize.js",
		navBarHidden:false
	});
        
        winVisualize.nav = navMain;
        winVisualize.parentModal = modalSection;
	winVisualize.db = modalSection.db;
	winVisualize.images = visualize;
	winVisualize.folder = folder;
	
	winVisualize.addEventListener('close', function(){
		visualize = modalSection.db.execute('SELECT * FROM `visualize` WHERE sectionID=' + modalSection.id);
	})
	
	navMain.open(winVisualize);
})
btnInteract.addEventListener('click',function()
{

	if ((interact.getRowCount() + interactInternal.getRowCount()) == 0) return;
	if (interact.getRowCount() == 1){
		var winInteract = Ti.UI.createWindow({
			//title: "Interact (" + sectionName + ")",
			rightNavButton: btnMainMenu,
			backgroundImage: lightBG,
			orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
			barColor: 'black',
			url: "interact.js",
			navBarHidden:false
		});
		
		winInteract.nav = navMain;
		winInteract.parentModal = modalSection;
		winInteract.db = modalSection.db;
		winInteract.videoURL = renderPath(interact.fieldByName('videoURL'));
		winInteract.folder = folder;
		winInteract.darkBG = darkBG;
		winInteract.sectionID = modalSection.id;
		
		winInteract.addEventListener('close', function(){
			interact = modalSection.db.execute('SELECT * FROM `interact` WHERE isInternal=0 AND sectionID=' + modalSection.id);
		})
		
		navMain.open(winInteract);
	}else{
		var winInteract = Ti.UI.createWindow({
			//title: "Interact (" + sectionName + ")",
			rightNavButton: btnMainMenu,
			backgroundImage: darkBG,
			orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
			barColor: 'black',
			url: "interact_gallery.js",
			navBarHidden:false
		});
		
		winInteract.nav = navMain;
		winInteract.parentModal = modalSection;
		winInteract.db = modalSection.db;
		winInteract.videos =  interact;
		winInteract.folder = folder;
		winInteract.lightBG = lightBG;
		winInteract.darkBG = darkBG;
		winInteract.sectionID = modalSection.id;
		
		
		winInteract.addEventListener('close', function(){
			interact = modalSection.db.execute('SELECT * FROM `interact` WHERE isInternal=0 AND sectionID=' + modalSection.id);
		})
		
		navMain.open(winInteract);
	}
});

btnEdu.addEventListener('click',function()
{

	if (educate.getRowCount() == 0) return;
	var winEducate = Ti.UI.createWindow({
		//title: "Visualize (" + sectionName + ")",
		rightNavButton: btnMainMenu,
                backgroundImage: darkBG,
                orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
                barColor: 'black',
                url: "educate.js",
		navBarHidden:false
	});
        
        winEducate.nav = navMain;
        winEducate.parentModal = modalSection;
	winEducate.db = modalSection.db;
	winEducate.docs = educate;
	winEducate.folder = folder;
	
	winEducate.addEventListener('close', function(){
		educate = modalSection.db.execute('SELECT * FROM `educate` WHERE sectionID=' + modalSection.id);
	})
	
	navMain.open(winEducate);

});

btnEval.addEventListener('click', function(){
	if (evaluate.getRowCount() == 0) return;
	var winEvaluate = Ti.UI.createWindow({
		//title: "Visualize (" + sectionName + ")",
		rightNavButton: btnMainMenu,
                backgroundImage: darkBG,
                orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
               barColor: 'black',
                url: "evaluate.js",
		navBarHidden:false
	});
        
        winEvaluate.nav = navMain;
        winEvaluate.parentModal = modalSection;
	winEvaluate.db = modalSection.db;
	winEvaluate.docs = evaluate;
	winEvaluate.folder = folder;
	
	winEvaluate.addEventListener('close', function(){
		evaluate = modalSection.db.execute('SELECT * FROM `evaluate` WHERE sectionID=' + modalSection.id);
	})
	
	navMain.open(winEvaluate);
})

modalSection.add(navMain);
modalWin.rightNavButton = btnMainMenu;

