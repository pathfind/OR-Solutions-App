var win = Ti.UI.currentWindow;
var products = (win.products);
var folder = win.folder;
var dataFolder = Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") + "/";
Ti.include("menu.js");

var btnExplore = createMenuOn("explore", 403); 
win.add(btnExplore);

btnExplore.addEventListener('click', function(){
	win.nav.close(win);
})

var btnVisualize = createMenuOff("visualize", 466); 
win.add(btnVisualize);

var btnInteract = createMenuOff("interact", 529);
win.add(btnInteract);

var btnEdu = createMenuOff("educate", 592); 
win.add(btnEdu);

var btnEval= createMenuOff("evaluate", 655);
win.add(btnEval);

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	bottom:15,
	height: 325,
	width: 680,
	left:40,
	showVerticalScrollIndicator:false,
	showHorizontalScrollIndicator:true,
	layout: 'horizontal',
	//backgroundColor: 'red',
	
});


var totalWidth = 0;
while (products.isValidRow()){
	var id = products.fieldByName('id');
	var title = products.fieldByName('productTitle');
	var desc = products.fieldByName('productDesc');
	var thumb =   renderPath(products.fieldByName('productThumbURL'));
	var productBG =  renderPath(products.fieldByName('productBackgroundImageURL'));
 
	var viewProduct = Ti.UI.createView({
		width: 'auto',
		height: 320,
		touchEnabled: true,
		zIndex: 10
		//backgroundColor: 'blue'
	});
	var imgProduct = Ti.UI.createImageView({
	     image: thumb,
	     height: 230,
	     width: 'auto',
	     left: 40,
	     bottom: 55
	});
	viewProduct.add(imgProduct);
	//alert(imgProduct.width);
		title = title.replace("(r)", "\u00AE");
	title = title.replace("(tm)", "\u2122");
	title = title.replace("(TM)", "\u2122");
	var lblProduct = Ti.UI.createLabel({
	     text: title,
	     left: 40,
	     top: 279,
	     width: imgProduct.width < 140 ? 140 : imgProduct.width,
	     //backgroundColor: 'red',
	     height: 'auto',
	     color: '#F2B13F',
	     font:{fontSize: 18 ,fontFamily: "Helvetica Neue"},
	     textAlign: 'center'
	});
	viewProduct.add(lblProduct);
	
	viewProduct.id = id;
	viewProduct.productBG = productBG;
	viewProduct.title = title;
	viewProduct.desc = desc;
	
	imgProduct.id = id;
	imgProduct.productBG = productBG;
	imgProduct.title = title;
	imgProduct.desc = desc;
	
	scrollView.add(viewProduct);
	
	totalWidth = totalWidth + 40 + imgProduct.width;
	
	products.next();
	
	viewProduct.addEventListener('click', function(e){
		var s = e.source;
		
		var winProduct = Ti.UI.createWindow({
			//title: title,
			rightNavButton: btnMainMenu,
			backgroundImage: s.productBG,
			orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
			barColor: 'black'
		});
	 
		win.nav.open(winProduct);
		
		var btnExplore = createMenuOn("explore", 403); 
		winProduct.add(btnExplore);
		
		btnExplore.addEventListener('click', function(){
			win.nav.close(winProduct);
		});
	        var lblTitle = Ti.UI.createLabel({
			text: s.title,
			color: '#F2B13F',
			font:{fontSize: 22 ,fontFamily: "Helvetica Neue"},
			left: 580,
			top: 213,
			width: 400,
			height: 20,
			//backgroundColor: "blue",
			textAlign: "left"
			
	        });
		winProduct.add(lblTitle);
		
		var viewDesc = Titanium.UI.createScrollView({
			top: 230,
			left: 580,
			contentWidth:370,
			contentHeight:'auto',
			height: 127,
			width: 400,
			showVerticalScrollIndicator:true,
			showHorizontalScrollIndicator:true
			//backgroundColor: 'red'
		});
		
		s.desc = s.desc.replace("(r)", "\u00AE");
		s.desc = s.desc.replace("(tm)", "\u2122");
		s.desc = s.desc.replace("(TM)", "\u2122");
		var lblDesc = Titanium.UI.createLabel({
			top: 5,
			color:'#fff',
			textAlign: 'left',
			text: s.desc,
			height: 'auto',
			shadowColor:'black',
			shadowOffset:{x:1,y:2},
			font:{fontSize:15,fontFamily:'Helvetica Neue'},
			width: 400
		});
	
		viewDesc.add(lblDesc);
		
		winProduct.add(viewDesc);
		
		var btnVisualize = createMenuOff("visualize", 466); 
		winProduct.add(btnVisualize);
		var btnInteract = createMenuOff("interact", 529);
		winProduct.add(btnInteract);
		var btnEdu = createMenuOff("educate", 592); 
		winProduct.add(btnEdu);
		var btnEval= createMenuOff("evaluate", 655);
		winProduct.add(btnEval);
	});
	
	imgProduct.addEventListener('click', function(e){
		
	});
	
	
}
win.add(scrollView);

function createButton(image, title){

   return viewProduct;

}

var scrollArrowRight = Ti.UI.createImageView({
    image: "images/explore_arrow_right.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    right: 270,
    bottom: 100
});
win.add(scrollArrowRight);

var scrollArrowLeft = Ti.UI.createImageView({
    image: "images/explore_arrow_left.png",
    //backgroundSelectedImage: "visualize/thumb_selected/" + image + ".jpg",
    backgroundColor: 'transparent',
    height: 128,
    width: 28,
    left: 5,
    bottom: 100
});
win.add(scrollArrowLeft);
//alert(scrollView.width);
//alert(totalWidth);
if (totalWidth < 795) scrollArrowRight.hide();
scrollArrowLeft.hide();

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

btnMainMenu.addEventListener('click',function()
{
	win.parentModal.close();  
});


function openNewWin(title, bgImage){
    
}