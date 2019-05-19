var mainmenubg, instructionsbg, creditsbg, aboutbg;
var instructionsBox, playBox, creditsBox, aboutBox;
var instructionsBack, creditsBack, aboutBack;
var bgm, clickedAThing;

function initScreens()
{
	mainmenubg = new createjs.Bitmap(queue.getResult("title-screen"));
	instructionsbg = new createjs.Bitmap(queue.getResult("instructions"));
	creditsbg = new createjs.Bitmap(queue.getResult("credits"));
	aboutbg = new createjs.Bitmap(queue.getResult("about"));

	instructionsBox = new createjs.Shape();
	instructionsBox.graphics.beginFill("#000000").drawRect(110, 840, 495, 145);
	instructionsBox.alpha = 0.01;
	instructionsBox.cursor = "pointer";

	playBox = new createjs.Shape();
	playBox.graphics.beginFill("#000000").drawRect(716, 825, 300, 180);
	playBox.alpha = 0.01;
	playBox.cursor = "pointer";

	creditsBox = new createjs.Shape();
	creditsBox.graphics.beginFill("#000000").drawRect(1120, 822, 300, 175);
	creditsBox.alpha = 0.01;
	creditsBox.cursor = "pointer";

	aboutBox = new createjs.Shape();
	aboutBox.graphics.beginFill("#000000").drawRect(1522, 822, 290, 172);
	aboutBox.alpha = 0.01;
	aboutBox.cursor = "pointer";

	instructionsBack = new createjs.Shape();
	instructionsBack.graphics.beginFill("#000000").drawRect(80, 918, 170, 106);
	instructionsBack.alpha = 0.01;
	instructionsBack.cursor = "pointer";

	creditsBack = new createjs.Shape();
	creditsBack.graphics.beginFill("#000000").drawRect(92, 896, 170, 106);
	creditsBack.alpha = 0.01;
	creditsBack.cursor = "pointer";

	aboutBack = new createjs.Shape();
	aboutBack.graphics.beginFill("#000000").drawRect(32, 950, 170, 106);
	aboutBack.alpha = 0.01;
	aboutBack.cursor = "pointer";

	instructionsBox.on("click", function(evt) { clickButton(SCREEN_INSTRUCTIONS); });
	playBox.on("click", function(evt) { clickButton(SCREEN_SALON); });
	creditsBox.on("click", function(evt) { clickButton(SCREEN_CREDITS); });
	aboutBox.on("click", function(evt) { clickButton(SCREEN_ABOUT); });
	instructionsBack.on("click", function(evt) { clickButton(SCREEN_MAIN_MENU); });
	creditsBack.on("click", function(evt) { clickButton(SCREEN_MAIN_MENU); });
	aboutBack.on("click", function(evt) { clickButton(SCREEN_MAIN_MENU); });
}

function showScreen(screen)
{
	currentScreen = screen;
	stage.cursor = "default";

	if (screen == SCREEN_MAIN_MENU)
	{
		stage.addChild(mainmenubg);
		stage.addChild(instructionsBox);
		stage.addChild(playBox);
		stage.addChild(creditsBox);
		stage.addChild(aboutBox);
	}
	else if (screen == SCREEN_INSTRUCTIONS)
	{
		stage.addChild(instructionsbg);
		stage.addChild(instructionsBack);
	}
	else if (screen == SCREEN_CREDITS)
	{
		stage.addChild(creditsbg);
		stage.addChild(creditsBack);
	}
	else if (screen == SCREEN_ABOUT)
	{
		stage.addChild(aboutbg);
		stage.addChild(aboutBack);
	}

	if (clickedAThing && !bgm) bgm = createjs.Sound.play("lobby", { loop: -1 });
}

function clickButton(screen)
{
	clickedAThing = true;
	createjs.Sound.play("click");

	stage.removeAllChildren();

	if (screen == SCREEN_SALON)
	{
		if (bgm) bgm.stop();
		enterSalon();
	}
	else
	{
		showScreen(screen);
	}
}
