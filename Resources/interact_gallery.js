var win = Ti.UI.currentWindow;
var videos = (win.videos);
var folder = win.folder;
var dataFolder = Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") + "/";
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

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	bottom:10,
	height: 470,
	width: 690,
	left:40,
	showVerticalScrollIndicator:false,
	showHorizontalScrollIndicator:true,
	//layout: 'horizontal',
	zIndex: 5,
	//backgroundColor: 'red',
	
});




var currentLeft= 40;
var totalWidth=0;
while (videos.isValidRow()){
	
	var id = videos.fieldByName('id');
	var videoTitle = videos.fieldByName('videoTitle');
	var thumbURL =  renderPath(videos.fieldByName('videoThumbURL'));
	var videoURL =  renderPath(videos.fieldByName('videoURL'));
	
 
	
	//alert(isInternal);
	
	Ti.API.info('Point reached. ' + videoTitle);
	
 
		var imgThumb = Ti.UI.createImageView({
			image: thumbURL,
			backgroundColor: 'transparent',
			height:233,
			width: 310,
			left: currentLeft,
			bottom: 55,
			zindex:10,
			thumbURLo: thumbURL,
			videoURL: videoURL,
			videoTitle: videoTitle,
			//fakeLeft: currentLeft
		});
		
		totalWidth = totalWidth + imgThumb.width + 20;
		
		Ti.API.info('Stepping in ' );
		scrollView.add(imgThumb);
		//565 x488
		Ti.API.info('Stepping out ' );
		
		imgThumb.addEventListener('touchstart', function(e){
			imgOnState.show();
			imgOnState.animate({bottom: -73,left: (e.source.left - 127), duration:0});
		});
	    
		imgThumb.addEventListener('touchend', function(e){
		     imgOnState.hide();
		});
		
		imgThumb.addEventListener('click', function(e){
			var s = e.source;
			
			var winInteract = Ti.UI.createWindow({
				//title: "Interact (" + sectionName + ")",
				rightNavButton: btnMainMenu,
				backgroundImage: win.lightBG,
				orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
				barColor: 'black',
				url: "interact.js",
				navBarHidden:false
			});
			
			winInteract.nav = win.nav;
			winInteract.videoURL = s.videoURL;
			winInteract.folder = folder;
			winInteract.isInternalVideosWin = true;
			
			win.nav.open(winInteract);
			
			imgOnState.hide();
		});
		
		var lblTitle = Ti.UI.createLabel({
		     text: videoTitle,
		     left: currentLeft,
		     bottom: 12,
		     width: 310,
		     //backgroundColor: 'red',
		     height: 'auto',
		     color: '#F2B13F',
		     font:{fontSize: 18 ,fontFamily: "Helvetica Neue"},
		     textAlign: 'center'
		});
		scrollView.add(lblTitle);
		
		currentLeft = currentLeft + 330
 
	videos.next();
};


win.add(scrollView);

var imgOnState = Ti.UI.createImageView({
		image: "images/interact_video_on.png",
		backgroundColor: 'transparent',
		height: 'auto',
		width: 'auto',
		left: -127,
		bottom: -73,
		zIndex: -10
        });
	
//scrollView.add(imgOnState);
imgOnState.hide();


function createButton(image, left){
    return Ti.UI.createButton({
    backgroundImage: "interact/thumb/" + image + "_off.png",
    backgroundSelectedImage: "interact/thumb/" + image + "_on.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 488,
    width: 565,
    left: left,
    bottom: 10
});

}

var scrollArrowRight = Ti.UI.createImageView({
    image: "images/explore_arrow_right.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    right: 255,
    bottom: 115
});
win.add(scrollArrowRight);

var scrollArrowLeft = Ti.UI.createImageView({
    image: "images/explore_arrow_left.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    left: 5,
    bottom: 110
});
win.add(scrollArrowLeft);

scrollArrowLeft.hide();
if (totalWidth < 795) scrollArrowRight.hide();

scrollView.addEventListener('scroll', function(e)
{
	imgOnState.hide();
	Ti.API.info('x ' + e.x + ' y ' + e.y);
	
	if (e.x > 30)
	{
		scrollArrowLeft.show();
	}
	else
	{
		scrollArrowLeft.hide();
	}
	if (e.x < (totalWidth - scrollView.width))
	{
		scrollArrowRight.show();
	}
	else
	{
		scrollArrowRight.hide();
	}

});

var btnMainMenu = Titanium.UI.createButton({
        title: "Main Menu"
});

btnMainMenu.addEventListener('click',function()
{
	win.parentModal.close();  
});


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
