var win = Ti.UI.currentWindow;
var images = (win.images);
var folder = win.folder;
var dataFolder = Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") + "/";
Ti.include("menu.js");

var btnExplore = createMenuOff("explore", 403); 
win.add(btnExplore);

var btnVisualize = createMenuOn("visualize", 466); 
win.add(btnVisualize);

var btnInteract = createMenuOff("interact", 529);
win.add(btnInteract);

var btnEdu = createMenuOff("educate", 592); 
win.add(btnEdu);

var btnEval= createMenuOff("evaluate", 655);
win.add(btnEval);

btnVisualize.addEventListener('click', function(){
	win.nav.close(win);
})

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	bottom:10,
	height: 350,
	width: 690,
	left:40,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true,
});

var totalWidth = 0;
var currentLeft = 10;
var currentButtom = 10;
var currentSwitch = false;
while (images.isValidRow()){
	var id = images.fieldByName('id');
	var imageTitle = images.fieldByName('imageTitle');
	var imageThumbURL = renderPath(images.fieldByName('imageThumbURL'));
	var imageLargeURL = renderPath(images.fieldByName('imageLargeURL'));
	
	var imgImage = Ti.UI.createImageView({
		image: imageThumbURL,
		backgroundColor: 'transparent',
		height: 160,
		width: 160,
		left: currentLeft,
		bottom: currentButtom,
		
		imageTitle: imageTitle,
		imageLargeURL: imageLargeURL
        });
        scrollView.add(imgImage);
	
	imgImage.addEventListener('click', function(e){
		var s = e.source;
		
		openImageWin(s.imageLargeURL, s.imageTitle);
	});
	
	if (currentButtom == 10){
		currentButtom = 175;
	}else{
		currentButtom = 10;
		currentLeft = currentLeft + 165;
		totalWidth = totalWidth +  imgImage.width + 5;
	}
	
	images.next();
}

win.add(scrollView);
//alert(totalWidth);

function createButton(image, left, bottom){
    return Ti.UI.createImageView({
    image: "images/thumb/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 160,
    width: 160,
    left: left,
    bottom: bottom
});

}

var scrollArrowRight = Ti.UI.createImageView({
    image: "images/explore_arrow_right.png",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    right: 255,
    bottom: 113
});
win.add(scrollArrowRight);

var scrollArrowLeft = Ti.UI.createImageView({
    image: "images/explore_arrow_left.png",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    left: 5,
    bottom: 113
});
win.add(scrollArrowLeft);
 
scrollArrowLeft.hide();
if (totalWidth < 795) scrollArrowRight.hide();
scrollView.addEventListener('scroll', function(e)
{
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
	//if (e.x < totalWidth / 2)
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


function openImageWin(imageName, title){
	
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var w = Titanium.UI.createWindow({
		backgroundColor:'black',
		
		height:720,
		width:980,
		borderRadius:10,
		opacity:0.9,
		transform:t
	});
	
	var image1 = Ti.UI.createImageView({
		image: imageName,
		//backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
		backgroundColor: 'transparent'
	});
	w.add(image1);
	
	var imgArrow = Ti.UI.createButton({
		backgroundImage: "images/close_arrow.png",
		left: 10,
		width: 100,
		height: 41,
		top: 50
        });
	w.add(imgArrow);
	
	imgArrow.addEventListener('click', function(){
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});
	
	var imgBox = Ti.UI.createView({
		
		
		right: -450,
		bottom: 0,
		width: 446,
		height: 66
		
        });
	w.add(imgBox);
	
	var lblTitle = Ti.UI.createLabel({
		text: title,
		textAlign: 'center',
		color: "white",
		width: 446,
		height: 66,
		backgroundColor: '#3F9141',
	});
	imgBox.add(lblTitle);
	
	var btnImgBox = Ti.UI.createButton({
		backgroundImage: "images/visualize_box_off.jpg",
		backgroundSelectedImage: "images/visualize_box_on.jpg",
		right: 0,
		bottom: 0,
		width: 62,
		height: 66,
		zIndex: 10
		
        });
	w.add(btnImgBox);
	var isBoxOpen = false;
	btnImgBox.addEventListener('click', function(){
		
		if (isBoxOpen == false){
			imgBox.animate({bottom: 0,right: 62, duration:500});
			isBoxOpen = true;
		}else{
			imgBox.animate({bottom: 0,right:-450, duration:500});
			isBoxOpen = false;
		}
	});
	

	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix();
	t1 = t1.scale(1.05);
	var a = Titanium.UI.createAnimation();
	a.transform = t1;
	a.duration = 200;

	w.open(a);
}

