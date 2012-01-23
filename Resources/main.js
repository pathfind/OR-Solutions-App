/*
TODO:
-Add (Tm) to each section
-Fix touch down image event

*/

Ti.include('menu.js');
var mainWin = Ti.UI.currentWindow;
var db;
var dataFolder;
mainWin.orientationModes = [
	Titanium.UI.LANDSCAPE_RIGHT,
	Titanium.UI.LANDSCAPE_LEFT
];
var mainView = Ti.UI.createScrollView({
    	contentWidth:'auto',
	contentHeight:'auto',
	bottom: 120,
	height: 260,
	width: 690,
	left:320,
	showVerticalScrollIndicator:false,
	showHorizontalScrollIndicator:true,
	layout: 'vertical',

});
mainWin.add(mainView);

var tblMenu = Ti.UI.createTableView({
   // data: tblData,
    backgroundColor: "transparent",
   
    bottom: 55,
    height: 340,
    width: 520,
    right:5,

    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
});
mainWin.add(tblMenu);

Titanium.App.addEventListener('loadSections', function(e){
    var currentDB =  Titanium.App.Properties.getString("versionID") + ".db";
    
    db = Ti.Database.open(currentDB);
    
    var sections = db.execute('SELECT * FROM `sections`');
    
    var sectionCount = (sections.getRowCount());
    tblMenu.scrollable  = (sectionCount >= 4);
    
    var tblData = [];
    dataFolder = Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") + "/";
    while (sections.isValidRow()){
	var sectionName = sections.fieldByName('name');
	var sectionDesc = sections.fieldByName('description');
    
	
	
	var secView = createNewRow(sectionName, sectionDesc);
	
	secView.sectionName  = sectionName;
	secView.folder = sections.fieldByName('folderName');
	secView.id = sections.fieldByName('id');
	
	secView.mainBG =  renderPath(sections.fieldByName('mainBackground'));
	secView.darkBG =  renderPath(sections.fieldByName('darkBackground'));
	secView.lightBG =  renderPath(sections.fieldByName('lightBackground'));
 
	
	tblData.push(secView);
	
	sections.next();
	
    }
    tblMenu.setData(tblData);
});


var currentDB =  Titanium.App.Properties.getString("versionID") + ".db";
var f = Ti.Filesystem.getFile( Ti.Filesystem.applicationSupportDirectory + '/database/' + currentDB  + '.sql');
  
if (!f.exists() ) {
    

	    createDir('assetslocal');
	    Titanium.Database.install('iPadPrefill.db','local.db');
	    Titanium.App.Properties.setString("versionID", 'local');
	    Ti.App.fireEvent("loadSections");
	    checkForUpdate();
		
    
}else{
    var g = Ti.Filesystem.getFile( Titanium.Filesystem.applicationDataDirectory + "/assets" + Titanium.App.Properties.getString("versionID") );
    if(!g.exists()){
	alert("The last downloaded content has been lost for whatever reason. Please download new content!");
			var updateWin = Titanium.UI.createWindow({
			    backgroundColor: 'white',
			     
			    //rightNavButton: btnClose,
			    title: "Update Content",
			    url: "update_content.js"
			
			});
			
			updateWin.open({
			    modal:true,
			    modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
			    modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			});
	f.deleteFile();
    }else{
	Ti.App.fireEvent("loadSections");
	checkForUpdate();
    }
}

function createDir(path){
    var folder = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, path);
    folder.createDirectory();
}

tblMenu.addEventListener('click', function(e){
    var d = e.rowData;
    
    var modal = Ti.UI.createWindow({
		navBarHidden: true,
		barColor: 'black',
		leftNavButton: null,
		orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
		url: "main_screen.js",
		
		sectionName: d.sectionName,
		folder: d.folder,
		id: d.id,
		db: db,
		mainBG: d.mainBG,
		darkBG: d.darkBG,
		lightBG: d.lightBG,
		dataFolder:  dataFolder
    });
    
    Titanium.UI.currentTab.open(modal,{animated:true}); 
});



function createNewRow(title, desc){
 
    var sectionView = Ti.UI.createTableViewRow({
	 selectedBackgroundColor: 'transparent',
	
	//backgroundColor: 'red',
	height: 75,
	width: 323,
	//right: 0,
	top: 5,
	className:"row"
    });

	title = title.replace("(r)", "\u00AE");
	title = title.replace("(tm)", "\u2122");
	title = title.replace("(TM)", "\u2122");
    var lblTitle = Ti.UI.createLabel({
	text: title,
	color: '#EEB211',
	font:{fontSize: 22 ,fontFamily: "Helvetica Neue"},
	left: 0,
	top: 1,
	width: 400,
	height: 20,
	//backgroundColor: "blue",
	textAlign: "right"
	
    });
    sectionView.add(lblTitle);
        	desc = desc.replace("(r)", "\u00AE");
	desc = desc.replace("(tm)", "\u2122");
	desc = desc.replace("(TM)", "\u2122");
    var lblDesc = Ti.UI.createLabel({
	text: desc,
	color: 'white',
	font:{fontSize: 20 ,fontFamily: "Helvetica Neue"},
	left: 0,
	top: 25,
	width: 400,
	height: 25,
	//backgroundColor: "blue",
	textAlign: "right"
	
    });
    sectionView.add(lblDesc);
    
    var imgArrow = Ti.UI.createImageView({
	image: "images/main_arrow_off.png",
	backgroundSelectedImage: "images/main_arrow_on.png",
	right: 5,
	width: 100,
	height: 41,
	top: 4
    });
    sectionView.add(imgArrow);
    
    sectionView.addEventListener('touchstart', function(e)
    {
	    imgArrow.image = "images/main_arrow_on.png";
    });
    
    sectionView.addEventListener('touchend', function(e)
    {
	    imgArrow.image = "images/main_arrow_off.png";
    });

    return sectionView;
};






function checkForUpdate(){
    
http1 = function(url, params, xhrTimeout, callback, errorcallback) {
    var paramsStr = JSON.stringify(params);
 
    var xhr = Titanium.Network.createHTTPClient();
    xhr.setTimeout(xhrTimeout);
 
    xhr.onload = function() {
        try{
            callback(JSON.parse(this.responseText), this.responseText);
        }catch(err){
            errorcallback(err);
        }  
    }
    
    xhr.onerror = function(e) {
        errorcallback(e);
    }
    
  
    xhr.open("GET", url);
    //xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send();
 
}
	  http1('http://strykerappmanagement.com/dump.php?appid=2', null, 20000, function(response, responseText) {
	      var versionID = response['versionID'];
	      var currentVersionID = Titanium.App.Properties.getString("versionID");
	      if (versionID != currentVersionID){
		var a = Titanium.UI.createAlertDialog({
			title:'Update Now',
			message:'New content available. Update now?',
			buttonNames: ['Yes','No'],
			cancel: 1
		});
		
		a.show();
		
		a.addEventListener('click', function(e){
		    if (e.index == 0){
			//Ti.include("update_content.js");
			var updateWin = Titanium.UI.createWindow({
			    backgroundColor: 'white',
			     
			    //rightNavButton: btnClose,
			    title: "Update Content",
			    url: "update_content.js"
			
			});
			
			updateWin.open({
			    modal:true,
			    modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL,
			    modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			});
		    }
		});
		
	      }else{
		//alert("App has the latest content!");
	      }
	  }, function(e){
	      Ti.API.info("Unable to download JSON data. MSG: " + e.error);
	      Ti.API.info(e.error);
	
          });
	  
	  
}


var imgBox = Ti.UI.createView({
		
    right: -450,
    bottom: 0,
    width: 446,
    height: 66
		
});
mainWin.add(imgBox);
	
var lblTitle = Ti.UI.createLabel({
    text: "9100-001-433 Rev None",
    textAlign: 'center',
    color: "white",
    width: 446,
    height: 66,
backgroundColor: '#3D9F5C',
});
imgBox.add(lblTitle);
	
var btnImgBox = Ti.UI.createButton({
    backgroundImage: "images/info_box_off.png",
    backgroundSelectedImage: "images/info_box_on.png",
    right: 0,
    bottom: 0,
    width: 62,
    height: 66,
    zIndex: 10
});

mainWin.add(btnImgBox);
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


