var win = Ti.UI.currentWindow;
var docs = win.docs;
var folder = win.folder;
var dataFolder = Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") + "/";
Ti.include("menu.js");

var btnExplore = createMenuOff("explore", 403); 
win.add(btnExplore);

var btnVisualize = createMenuOff("visualize", 466); 
win.add(btnVisualize);

var btnInteract = createMenuOff("interact", 529);
win.add(btnInteract);

var btnEdu = createMenuOn("educate", 592); 
win.add(btnEdu);

var btnEval= createMenuOff("evaluate", 655);
win.add(btnEval);

btnEdu.addEventListener('click', function(){
	win.nav.close(win);
})


var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight: 380,
	bottom:20,
	height: 380,
	width: 690,
	left:40,
	showVerticalScrollIndicator:false,
	showHorizontalScrollIndicator:true,
	layout: 'horizontal'
});

var totalWidth=0;
while (docs.isValidRow()){
	var docThumbURL =  renderPath(docs.fieldByName('educateThumbURL'));
	var docPDFURL =  renderPath(docs.fieldByName('educatePDFURL'));
	
	var imgThumb = Ti.UI.createImageView({
		image: docThumbURL,
		backgroundColor: 'transparent',
		height: 'auto',
		width: 'auto',
		left: 17,
		bottom: 10,
		
		docPDFURL: docPDFURL
	});
	scrollView.add(imgThumb);
	
	imgThumb.addEventListener('click', function(e){
		var s = e.source;
		 
		openWebViewWin(s.docPDFURL);
	});
	//alert(imgThumb.width);
	totalWidth = totalWidth + imgThumb.width  + 17 ;
	docs.next();
};

win.add(scrollView);


function createButton(image){
    return Ti.UI.createImageView({
    image: image,
    backgroundColor: 'transparent',
    height: 'auto',
    width: 'auto',
    left: 5,
    bottom: 10
});

}

var scrollArrowRight = Ti.UI.createImageView({
    image: "images/explore_arrow_right.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    right: 260,
    bottom: 150});
win.add(scrollArrowRight);

var scrollArrowLeft = Ti.UI.createImageView({
    image: "images/explore_arrow_left.png",
 
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    left: 5,
    bottom: 150
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

btnMainMenu.addEventListener('click',function(){
	win.parentModal.close();  
});


function openWebViewWin(urlName){
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var w = Titanium.UI.createWindow({
		backgroundColor:'black',
		
		height:720,
		width:980,
		
		
		transform:t
	});
	


	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix();
	t1 = t1.scale(1.1);
	var a = Titanium.UI.createAnimation();
	a.transform = t1;
	a.duration = 200;

	// when this animation completes, scale to normal size
	a.addEventListener('complete', function()
	{
		 
		
		var PDF = Ti.UI.createWebView({
			url: urlName,
			backgroundColor: "white",
			scalesPageToFit: true
		});
		w.add(PDF);

	});

	var imgArrow1 = Ti.UI.createButton({
		backgroundImage: "images/left_arrow.png",
		left: 20, //20,
		width: 75,
		height: 75,
		top: 20,
		zIndex: 10,
		opacity: .6
        });
	w.add(imgArrow1);
	
	var imgEmail = Ti.UI.createButton({
		backgroundImage: "images/email.png",
		right: 30, //20,
		width: 50,
		height: 50,
		top: 20,
		zIndex: 10,
		opacity: .6
        });
	w.add(imgEmail);
	
	imgArrow1.addEventListener('click', function(){
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});
	
	imgEmail.addEventListener('click', function(){
		var emailDialog = Titanium.UI.createEmailDialog();
		if (!emailDialog.isSupported()) {
			Ti.UI.createAlertDialog({
				title:'Error',
				message:'Email not available. Are you sure this device has mail setup?'
			}).show();
			return;
		}
		emailDialog.setSubject('Document Attached');
		emailDialog.setMessageBody('<b>Document Attached!</b>');
		emailDialog.setHtml(true);
		emailDialog.setBarColor('#336699');
		//alert(urlName);
		var f = Ti.Filesystem.getFile(urlName);
		emailDialog.addAttachment(f);
		emailDialog.addEventListener('complete',function(e){
			if (e.result == emailDialog.SENT){
			   alert("Message sent!");
			}
		});
		emailDialog.open();
	});
	


	w.open(a);
}

