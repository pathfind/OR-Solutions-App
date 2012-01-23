var mainWin = Titanium.UI.createWindow({
 
    backgroundImage: 'images/main/bg.jpg',
    orientationModes: [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT],
    navBarHidden: true,
    tabBarHidden: true,
    url: 'main.js'
});

var tabGroup = Titanium.UI.createTabGroup(
{
	barColor:'#336699'
});


var tab1 = Titanium.UI.createTab({
    icon:'images/tabs/KS_nav_views.png',
    title:'Base UI',
    window:mainWin
});

tabGroup.addTab(tab1);
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});
//mainWin.open();
