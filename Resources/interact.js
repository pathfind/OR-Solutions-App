var win = Ti.UI.currentWindow;
var images = (win.images);
var folder = win.folder;

Ti.include("menu.js");

if (!win.isInternalVideosWin) win.isInternalVideosWin = false;
var btnExplore = createMenuOff("explore", 403); 
win.add(btnExplore);
Ti.API.info('creating explore menu...');
var btnVisualize = createMenuOff("visualize", 466); 
win.add(btnVisualize);
Ti.API.info('creating visualize menu...');
var btnInteract = createMenuOn("interact", 529);
win.add(btnInteract);
Ti.API.info('creating interact menu...');
var btnEdu = createMenuOff("educate", 592); 
win.add(btnEdu);
Ti.API.info('creating educate menu...');
var btnEval= createMenuOff("evaluate", 655);
win.add(btnEval);
Ti.API.info('creating evaluate menu...');
btnInteract.addEventListener('click', function(){
	win.nav.close(win);
})

win.addEventListener('close', function(){
   // win.snapVideoPlayer.stop();
 
   activeMovie.stop();
   activeMovie.release();
   activeMovie = null;
})


var btnMainMenu = Titanium.UI.createButton({
        title: "Main Menu"
});

btnMainMenu.addEventListener('click',function()
{
	//win.snapVideoPlayer.stop();
	
	//activeMovie.stop();
   activeMovie.stop();
   activeMovie.release();
   activeMovie = null;
	win.parentModal.close();
	
});

var imgImage = Ti.UI.createImageView({
		image: "images/video_player_effect.png",
		backgroundColor: 'transparent',
		height: 820,
		width: 1040,
		left: -150,
		bottom: -162,
		
});
win.add(imgImage);
        


var activeMovie;

win.addEventListener('focus', function(){
	
		activeMovie = Titanium.Media.createVideoPlayer({
			contentURL: win.videoURL,
			backgroundColor:'black',
			movieControlStyle: Titanium.Media.VIDEO_CONTROL_EMBEDDED,
			//scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FILL,
			width:700,
			height:440,
			left: 30,
			bottom: 30,
			autoplay:false
		});
		
		
		win.add(activeMovie);

})

if (win.isInternalVideosWin == false){
	var interactInternal = win.db.execute('SELECT * FROM `interact` WHERE isInternal=1 AND sectionID=' + win.sectionID);
	if (interactInternal.getRowCount() > 0){
		var lblInternalVideos = Ti.UI.createLabel({
			text: "Internal Use Only",
			top:2,
			right: 5,
			height:20,
			width: 'auto',
			color: '#F2B13F',
			font:{fontSize: 14 ,fontFamily: "Helvetica Neue"}
		});
		win.add(lblInternalVideos);
		
		lblInternalVideos.addEventListener('click', function(){
				 activeMovie.stop();
				 activeMovie.release();
				var winInteract = Ti.UI.createWindow({
					//title: "Interact (" + sectionName + ")",
					rightNavButton: btnMainMenu,
					backgroundImage: win.darkBG,
					orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
					barColor: 'black',
					url: "interact_gallery.js",
					navBarHidden:false
				});
				
				winInteract.nav = win.nav;
				winInteract.videos =  interactInternal;
				winInteract.folder = folder;
				winInteract.lightBG = win.lightBG;
				winInteract.darkBG = win.darkBG;
				winInteract.isInternalVideosWin = true;
				
				winInteract.addEventListener('close', function(){
					interactInternal = win.db.execute('SELECT * FROM `interact` WHERE isInternal=1 AND sectionID=' + win.sectionID);
				})
				
				win.nav.open(winInteract); 
		})
	}
}
