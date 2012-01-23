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

var btnEdu = createMenuOff("educate", 592); 
win.add(btnEdu);

var btnEval= createMenuOn("evaluate", 655);
win.add(btnEval);

btnEval.addEventListener('click', function(){
	win.nav.close(win);
})

win.addEventListener('close', function(){
     
})

var btnMainMenu = Titanium.UI.createButton({
        title: "Main Menu"
});

btnMainMenu.addEventListener('click',function(){
	win.parentModal.close();
	
});

var evalBars =  Ti.UI.createImageView({
	image: "images/eval_bar.png",
	left: 90,
	width: 'auto',
	height: 'auto',
	top: 250
    });
win.add(evalBars)
var tblData = [];

while (docs.isValidRow()){
    var docTitle = docs.fieldByName('documentTitle');
    var docPDFurl =  renderPath(docs.fieldByName('documentPDFURL'));

    var linkView = createDocLink(docTitle, docPDFurl);
    
    linkView.docTitle  = docTitle;
    linkView.docPDFurl = docPDFurl;
    
    tblData.push(linkView);
    
    docs.next();
    
}

var tblDocs = Ti.UI.createTableView({
    data: tblData,
    backgroundColor: "transparent",
   
    top: 270,
    height: 380,
    width: 570,
    left: 110,
    //allowsSelection: false,
   // scrollable: (sectionCount >= 4),
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    
});

win.add(tblDocs);

tblDocs.addEventListener('click', function(e){
	openWebViewWin(e.rowData.docPDFurl);
});

function createDocLink(title, pdf){
    var linkRow = Ti.UI.createTableViewRow({
	 selectedBackgroundColor: 'transparent',
	
	//backgroundColor: 'red',
	minHeight: 'auto',
	width: 520,
	//right: 0,
	top: 5,
	className:"row"
    });

    title = title.replace("(r)", "\u00AE");
    title = title.replace("(tm)", "\u2122");
    title = title.replace("(TM)", "\u2122");
    title = title.replace("(TM)", "\u2122");
    var lblTitle = Ti.UI.createLabel({
	text: title,
	color: '#EEB211',
	font:{fontSize: 22 ,fontFamily: "Helvetica Neue"},
	left: 70,
	top: 4,
	width: 500,
	height: 'auto',
	//backgroundColor: "blue",
	textAlign: "left"
	
    });
    
    linkRow.height = lblTitle.height + 20;
    linkRow.add(lblTitle);
    
    
    var imgArrow = Ti.UI.createImageView({
	image: "images/eval_main_arrow_off.png",
	backgroundSelectedImage: "images/eval_link_arrow_on.png",
	left: 5,
	width: 60,
	height: 25,
	top: 9
    });
    linkRow.add(imgArrow);
    
    linkRow.addEventListener('touchstart', function(e)
    {
	    imgArrow.image = "images/eval_link_arrow_on.png";
    });
    
    linkRow.addEventListener('touchend', function(e)
    {
	    imgArrow.image = "images/eval_link_arrow_off.png";
    });

 
    return linkRow;
}



var scrollArrowDown = Ti.UI.createImageView({
    image: "images/eval_arrow_down.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 127,
    width: 25,
    right: 300,
    bottom: 5,

});
win.add(scrollArrowDown);

var scrollArrowUp = Ti.UI.createImageView({
    image: "images/eval_arrow_up.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 127,
    width: 25,
    right: 300,
    bottom: 350,

});
win.add(scrollArrowUp);
scrollArrowUp.hide();
scrollArrowDown.hide();

var lastY;
tblDocs.addEventListener('scroll', function(e)
{
	Ti.API.info('x ' + e.contentOffset.x + ' y ' + e.contentOffset.y);
	if (e.contentOffset.y > lastY) {
		scrollArrowDown.show();
		scrollArrowUp.hide();
	}else{
		scrollArrowDown.hide();
		scrollArrowUp.show();		
	}
	
	lastY = e.contentOffset.y;
	

});
 
tblDocs.addEventListener('scrollEnd', function(){
	scrollArrowUp.hide();
	scrollArrowDown.hide();
})


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

	var imgArrow1 = Ti.UI.createImageView({
		image: "images/left_arrow.png",
		left: 20, //20,
		width: 75,
		height: 75,
		top: 20,
		zIndex: 10,
		opacity: .6
        });
	w.add(imgArrow1);
	
	imgArrow1.addEventListener('click', function(){
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});

	w.open(a);
}


