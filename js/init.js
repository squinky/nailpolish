var stage;
var ACTUAL_WIDTH = 1920;
var ACTUAL_HEIGHT = 1080;
var ASPECT_RATIO = 16/9;

var currentScreen;
var SCREEN_LOADING = 0;
var SCREEN_SALON = 1;
var SCREEN_MAIN_MENU = 2;
var SCREEN_INSTRUCTIONS = 3;
var SCREEN_CREDITS = 4;
var SCREEN_ABOUT = 5;

var queue;
var lastTickTime;
var loadText;

window.addEventListener('resize', resize, false);

function init()
{
	stage = new createjs.Stage("gameCanvas");
	stage.enableMouseOver();
	createjs.Touch.enable(stage);
	createjs.Ticker.addEventListener("tick", tick);
	resize();
	
	showLoadingScreen();
	
	queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	queue.on("complete", loadingComplete, this);
	queue.loadManifest("manifest.json");
}

function showLoadingScreen()
{
	currentScreen = SCREEN_LOADING;
	loadText = new createjs.Text("loading: 0%", "72px Fifth Grade Cursive Regular", "#ffffff");
	loadText.textAlign = "center";
	loadText.x = ACTUAL_WIDTH/2;
	loadText.y = ACTUAL_HEIGHT/2 - 36;
	stage.addChild(loadText);
}

function loadingComplete()
{
	stage.removeChild(loadText);

	initSalon();
	initScreens();
	showScreen(SCREEN_MAIN_MENU);
}

function tick()
{
	var timeSinceLastTick = createjs.Ticker.getTime() - lastTickTime;
	lastTickTime = createjs.Ticker.getTime();

	if (currentScreen == SCREEN_LOADING)
	{
		loadText.text = "loading: "+Math.floor(queue.progress*100)+"%";
	}
	else if (currentScreen == SCREEN_SALON)
	{
		updateSalon(timeSinceLastTick);
	}
	
	stage.update();
}

function resize()
{	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight; 
	   
	if (stage.canvas.width/stage.canvas.height < ASPECT_RATIO)
	{
		stage.scaleX = stage.canvas.width/ACTUAL_WIDTH;
		stage.scaleY = stage.scaleX;
		stage.y = (stage.canvas.height-(ACTUAL_HEIGHT*stage.scaleY))/2
		stage.x = 0;
	}
	else
	{
		stage.scaleY = stage.canvas.height/ACTUAL_HEIGHT;
		stage.scaleX = stage.scaleY;
		stage.x = (stage.canvas.width-(ACTUAL_WIDTH*stage.scaleX))/2
		stage.y = 0;
	}
}
