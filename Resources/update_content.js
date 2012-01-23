var updateWin = Ti.UI.currentWindow;
 
var downloadFiles = [];
//var downloader = require('com.download1');
var versionID;
var lastDownloadType;
var isDownloading = false;

var intCount = 0;
var maxLen = 0;
var currentFile;

var btnClose = Ti.UI.createButton({
    title:"Close"
});
    
btnClose.addEventListener("click", function(){
    updateWin.close(); 
});
    
var button1 = Ti.UI.createButton({title: "Start Download",  width:500, height: 100, top: 170});
updateWin.add(button1);
    
    
var lblStatus = Ti.UI.createLabel({text:"Ready to download!", textAlign: "top", top: 300, width: 500, height: 250 })

updateWin.add(lblStatus);
    
button1.addEventListener('click', function(){
  if (isDownloading == true) return;
  if (button1.title == "Close"){
      updateWin.close();
    
  }else{
      lblStatus.text  = lblStatus.text + "\n" + "Preparing to download files..."
	  http('http://strykerappmanagement.com/dump.php?appid=2', null, 20000, function(response, responseText) {
	      versionID = response['versionID'];
	      var currentVersionID = Titanium.App.Properties.getString("versionID");
	      if (versionID != currentVersionID){
		//alert("Dowmloading new files ..");
		isDownloading = true;
		startDownloadProcess(response);
	      }else{
		alert("App already has the latest content!");
	      }
	  }, function(e){
	    alert("Unexpected Error: " + e.error);
	      Ti.API.info("Unable to download JSON data. MSG: " + e.error);
	      Ti.API.info(e.error);
	
          });
  }
});
    
    
var ind1= Titanium.UI.createProgressBar({
                                                width:500,
                                                height:50,
                                               // min:0,
                                                //max: 10,
                                               // value:0,
                                                style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
                                                top: 0,
                                                message:'File Progress',
                                                font:{fontSize:12 },
                                                color:'gray',
                                                zIndex: 10
                                });
                                
updateWin.add(ind1);
ind1.show();
    
var ind2 =Titanium.UI.createProgressBar({
	    width:500,
	    min:0,
	    max:10,
	    value:0,
	    height:90,
	    color:'gray',
	    message:'Overall Progress',
	    font:{fontSize:14, fontWeight:'bold'},
	    style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
	    top: 60
});
    
updateWin.add(ind2);
ind2.show();



function startDownloadProcess(res){
 
  var sections = res['assests'];

  var f = Ti.Filesystem.getFile( Ti.Filesystem.applicationSupportDirectory + '/database/' + res['versionID']  + '.db.sql');
  if (f.exists()) f.deleteFile();
  
  var dbNew = Titanium.Database.install('iPadDBempty.db',res['versionID'] + '.db');
  for (x in sections){
    var section = sections[x];
    var name = section['name'];
    var folderName = section['folderName'];
    var description = section['description'];
    
    var mainBackground = extractFileName(section['mainBackground']);
    var lightBackground = extractFileName(section['lightBackground']);
    var darkBackground = extractFileName(section['darkBackground']);
    
    var folderPath =  homeDir() + '/assets' + res['versionID'] + '/' + folderName;
    
    
    downloadFiles.push([section['mainBackground'],  mainBackground, "background images"]);
    downloadFiles.push([section['lightBackground'], lightBackground, "background images"]);
    downloadFiles.push([section['darkBackground'],  darkBackground, "background images"]);
    

    var query = ('INSERT INTO sections (name,folderName,description,mainBackground,lightBackground,darkBackground) VALUES("' + name + '", "' + folderName + '", "' + description + '", "' + homeDir() + "/downloads/"  + mainBackground + '", "' + homeDir() + "/downloads/"  + lightBackground + '", "' + homeDir() + "/downloads/"  + darkBackground + '")');
    dbNew.execute(query);
    var sectionID = dbNew.lastInsertRowId;
    
    
    createDir('assets' + res['versionID'] + '');
    createDir('downloads');
    createDir('assets' + res['versionID'] + '/' + folderName);
    createDir('assets' + res['versionID'] + '/' + folderName + '/explore');
    createDir('assets' + res['versionID'] + '/' + folderName + '/bg');
    createDir('assets' + res['versionID'] + '/' + folderName + "/explore/thumb");
    createDir('assets' + res['versionID'] + '/' + folderName + "/explore/bg");
    createDir('assets' + res['versionID'] + '/' + folderName + "/educate");
    createDir('assets' + res['versionID'] + '/' + folderName + "/educate/thumb");
    createDir('assets' + res['versionID'] + '/' + folderName + "/educate/pdf");
    createDir('assets' + res['versionID'] + '/' + folderName + "/evaluate");
    createDir('assets' + res['versionID'] + '/' + folderName + "/evaluate/pdf");
    createDir('assets' + res['versionID'] + '/' + folderName + "/interact");
    createDir('assets' + res['versionID'] + '/' + folderName + "/interact/thumb");
    createDir('assets' + res['versionID'] + '/' + folderName + "/interact/videos");
    createDir('assets' + res['versionID'] + '/' + folderName + "/visualize");
    createDir('assets' + res['versionID'] + '/' + folderName + "/visualize/thumb");
    createDir('assets' + res['versionID'] + '/' + folderName + "/visualize/large");
    
    for (y in section['explore']){
      var product =  section['explore'][y];
      var productTitle = product['productTitle'];
      var productDesc = product['productDesc'];
      
      var productThumbURL = extractFileName(product['productThumbURL']);
      var productBackgroundImageURL = extractFileName(product['productBackgroundImageURL']);
      
      downloadFiles.push([product['productThumbURL'], productThumbURL, "products"]);
      downloadFiles.push([product['productBackgroundImageURL'],   productBackgroundImageURL, "products"]);
	
      //alert(productBackgroundImageURL);
      var query = ('INSERT INTO explore (productTitle,productDesc,productThumbURL,productBackgroundImageURL,sectionID) VALUES("' + (productTitle) + '", "' + (productDesc) + '", "' + homeDir() + "/downloads/"  + productThumbURL + '", "' + homeDir() + "/downloads/"  + productBackgroundImageURL + '", ' + sectionID + ')');
      Ti.API.info(query);
      dbNew.execute(query);
    }
    

 
    for (y in section['educate']){
      Ti.API.info("Downloading educate assets..");
	var edu =  section['educate'][y];
	
	var educateThumbURL = extractFileName(edu['educateThumbURL']);
	var educatePDFURL = extractFileName(edu['educatePDFURL']);
	
	downloadFiles.push([edu['educateThumbURL'],  educateThumbURL, "documents"]);
	downloadFiles.push([edu['educatePDFURL'],  educatePDFURL, "documents"]);
	
	var query = ('INSERT INTO educate (educateThumbURL,educatePDFURL, sectionID) VALUES("' + homeDir() + "/downloads/"  +educateThumbURL + '", "' + homeDir() + "/downloads/"  +educatePDFURL + '", ' + sectionID + ')');
	//alert(query);
	Ti.API.info(query);
	dbNew.execute(query);
    }
 
    for (y in section['evaluate']){
      Ti.API.info("Downloading evaluate assets..");
	var evaluate =  section['evaluate'][y];
	
	var documentTitle = (evaluate['documentTitle']);
	

	var documentPDFURL = extractFileName(evaluate['documentPDFURL']);
	
	downloadFiles.push([evaluate['documentPDFURL'], documentPDFURL, "documents"]);
	//alert( evaluate['documentPDFURL']);
	
	var query = ('INSERT INTO evaluate (documentTitle, documentPDFURL, sectionID) VALUES("' + documentTitle + '", "' + homeDir() + "/downloads/"  +documentPDFURL + '", ' + sectionID + ')');
	//alert(query);
	Ti.API.info(query);
	dbNew.execute(query);
    }
         
     
    for (y in section['interact']){
      Ti.API.info("Downloading interact assets..");
	var interact =  section['interact'][y];
	
	var videoTitle = interact['videoTitle'];
	var videoThumbURL = extractFileName(interact['videoThumbURL']);
	var videoURL = extractFileName(interact['videoURL']);
	var isInternal = interact['videoInternal'];
	
	 
	
	downloadFiles.push([interact['videoThumbURL'], videoThumbURL, "videos"]);
	downloadFiles.push([interact['videoURL'], videoURL, "videos"]);
	
	var query = ('INSERT INTO interact (videoTitle, videoThumbURL, videoURL, sectionID, isInternal) VALUES("' + videoTitle + '", "' + homeDir() + "/downloads/"  +videoThumbURL + '", "' + homeDir() + "/downloads/"  +videoURL + '", ' + sectionID + ', ' + isInternal + ')');
	//alert(query);
	Ti.API.info(query);
	dbNew.execute(query);
    }
    
    for (y in section['visualize']){
      Ti.API.info("Downloading visualize assets...");
	var visualize =  section['visualize'][y];
	
	var imageTitle = visualize['imageTitle'];
	var imageThumbURL = extractFileName(visualize['imageThumbURL']);
	var imageLargeURL = extractFileName(visualize['imageLargeURL']);
	
	downloadFiles.push([visualize['imageThumbURL'], imageThumbURL, "images"]);
	downloadFiles.push([visualize['imageLargeURL'], imageLargeURL, "images"]);
	
	
	var query = ('INSERT INTO visualize (imageTitle, imageThumbURL, imageLargeURL, sectionID) VALUES("' + imageTitle + '", "' + homeDir() + "/downloads/"  +imageThumbURL + '",  "' + homeDir() + "/downloads/"  +imageLargeURL + '", ' + sectionID + ')');
	//alert(query);
	Ti.API.info(query);
	dbNew.execute(query);
    }
  
 
  
  }
  
  ind2.max = downloadFiles.length;
  lblStatus.text  = lblStatus.text + "\n" + "Downloading "+ downloadFiles.length + " files...";
  ind2.value = 0;
  Ti.API.info(downloadFiles);
  dlFile();
}

function fileExists(file){
  var f = Ti.Filesystem.getFile(homeDir() + "/downloads/" + file);
  if (f.exists() ) {
    return true;
  }
  
  var g = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + "/downloads/" + file);
  if (g.exists() ) {
    fileCopy(Titanium.Filesystem.resourcesDirectory + "/downloads/" + file,homeDir() + "/downloads/" + file);
    return true;
  }
  return false;
}

function fileMove(currentPath, newPath){
  var f = Ti.Filesystem.getFile( currentPath);
  f.move(newPath);
}

function fileCopy(currentPath, newPath){
  ind1.message = "Cache found. Copying file " + (ind2.value + 1) + " of " + ind2.max + " (Please wait...)" ;
  ind1.max = 2;
  ind1.value = 1;
  var imgFilename = Ti.Filesystem.applicationDataDirectory + "/image.jpg";
  var f = Ti.Filesystem.getFile(currentPath);
  var d = Ti.Filesystem.getFile(newPath);
   
  d.write(f);
  
  ind1.value = 2;

}
function dlFile(noShift,fileToDownload1){
      
    if (!noShift){
		var fileToDownload = downloadFiles.shift();
    }else{
		var fileToDownload = fileToDownload1;
    }
      


   	if (fileToDownload[2] != lastDownloadType) lblStatus.text = lblStatus.text + "\n" + "Downloading " + fileToDownload[2] + "..."
    
    lastDownloadType = fileToDownload[2];
  
    if (fileExists(fileToDownload[1]) == false){
    	
    		var c = Titanium.Network.createHTTPClient();
		    ind1.value = 0;
            ind1.message = "Downloading file " + fileToDownload[1];
            
			c.onload = function(e){
			    fileMove(homeDir(false) + fileToDownload[1], homeDir() + "/downloads/" + fileToDownload[1]);
			    ind2.value = ind2.value + 1;
			    if (downloadFiles.length > 0) {
			      dlFile();
			    }else{
			      Titanium.App.Properties.setString("versionID", versionID);
			      ind2.message = "Completed!";ind1.message = "Completed!";
			      lblStatus.text = lblStatus.text + "\n" + "All files downloaded. Touch continue to load data!" ;
			      button1.title = "Close";
			      isDownloading = false;
			      Ti.App.fireEvent("loadSections");
			      updateWin.close();
			      alert("Content Updated!");
			    }
			};
                        
            c.ondatastream = function(e){
            	ind1.value = e.progress ;
            };
            
			c.onerror = function(e){
            	//progressInd.value = (progressInd.value - 1)
				dlFile(true,fileToDownload);
			};
		
			c.open('GET',encodeURI(fileToDownload[0]));
			c.file = Ti.Filesystem.getFile(homeDir(false) + fileToDownload[1]);
			c.send();
	
			
     }else{
	
		  ind2.value = ind2.value + 1;
		  if (downloadFiles.length > 0) {
		    dlFile();
		  }else{
		      Titanium.App.Properties.setString("versionID", versionID);
		      ind2.message = "Completed!";ind1.message = "Completed!";
		      lblStatus.text = lblStatus.text + "\n" + "All files downloaded. Touch continue to load data!" ;
		      button1.title = "Close";
		      isDownloading = false;
		      Ti.App.fireEvent("loadSections");
		      updateWin.close();
		      alert("Content Updated!");
		  }
	  
    }

}

function extractFileName(url){
   var filename = url.substring(url.lastIndexOf('/')+1);
    return filename;
}

function homeDir(returnSlash){
  if (returnSlash == true){
    return Titanium.Filesystem.applicationDataDirectory + "/";
  }else{
    return Titanium.Filesystem.applicationDataDirectory;
  }
}



function createDir(path){
    var folder = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, path);
    folder.createDirectory();
}
http = function(url, params, xhrTimeout, callback, errorcallback) {
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