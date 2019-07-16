var salonbg, handContainer, hand, paint, brush, brushColour, painting, paintTimeElapsed, lastX, lastY;
var bottles = [];
var finishButton, finished, stockPhoto, endTimeElapsed;

function initSalon()
{
	salonbg = new createjs.Bitmap(queue.getResult("main_background"));

	handContainer = new createjs.Container();
	handContainer.mouseEnabled = true;
	handContainer.mouseChildren = false;
	hand = new createjs.Bitmap(queue.getResult("hand1"));
	paint = new createjs.Shape();
	handContainer.addChild(hand);
	handContainer.addChild(paint);

	brush = new createjs.Bitmap(queue.getResult("lid_red"));
	brush.regX = brush.getBounds().width/2;
	brush.regY = brush.getBounds().height*13/16;
	brush.scaleX = 0.4;
	brush.scaleY = 0.4;
	brush.mouseEnabled = false;

	addBottle("red");
	addBottle("orange");
	addBottle("yellow");
	addBottle("green");
	addBottle("blue");
	addBottle("indigo");
	addBottle("violet");

	for (var i = 0; i < bottles.length; i++)
	{
		bottles[i].scaleX = 0.4;
		bottles[i].scaleY = 0.4;
		bottles[i].x = 150*i;
		bottles[i].y = ACTUAL_HEIGHT - 250;
		bottles[i].on("click", function(evt)
		{
			brushColour = evt.target.colour;
			createjs.Sound.play("sploosh");
		});
	}

	finishButton = new createjs.Bitmap(queue.getResult("finish-button"));
	finishButton.x = ACTUAL_WIDTH - 400;
	finishButton.y = ACTUAL_HEIGHT - 220;
	finishButton.on("click", function(evt) { finishNails(); });

	bottomBox = new createjs.Shape();
	bottomBox.graphics.beginFill("#000000").drawRect(0, ACTUAL_HEIGHT, ACTUAL_WIDTH, 400);

	handContainer.on("mousedown", function(evt) { painting = true; });
	handContainer.on("pressmove", function(evt) { painting = true; });
	stage.on("stagemouseup", function(evt) { painting = false; });

	stockPhoto = new createjs.Bitmap(queue.getResult("nails1"));
}

function addBottle(c)
{
	var newBottle = new createjs.Bitmap(queue.getResult("bottle_"+c));
	newBottle.colour = c;
	bottles.push(newBottle);
}

function enterSalon()
{
	currentScreen = SCREEN_SALON;

	var handColour = Math.random() < 0.75 ? 1 : 2;
	hand.image = queue.getResult("hand"+handColour);

	stage.addChild(salonbg);
	stage.addChild(handContainer);
	stage.addChild(finishButton);

	handContainer.removeChild(paint);
	paint = new createjs.Shape();
	handContainer.addChild(paint);

	for (var i = 0; i < bottles.length; i++)
	{
		stage.addChild(bottles[i]);
	}

	stage.addChild(bottomBox);
	stage.addChild(brush);

	brushColour = "red";
	painting = false;

	finished = false;

	bgm = createjs.Sound.play("salon", { loop: -1 });
}

function updateSalon(timeSinceLastTick)
{
	if (finished)
	{
		endTimeElapsed += timeSinceLastTick;

		if (endTimeElapsed < 1000)
		{
			stockPhoto.alpha = endTimeElapsed/1000;
		}
		else if (endTimeElapsed < 10000)
		{
			stockPhoto.alpha = 1;
		}
		else if (endTimeElapsed < 11000)
		{
			if (stage.getChildIndex(mainmenubg) == -1) stage.addChild(mainmenubg);
			mainmenubg.alpha = (endTimeElapsed-10000)/1000;
		}
		else
		{
			stage.removeAllChildren();
			showScreen(SCREEN_MAIN_MENU);
		}
		return;
	}

	var newPos = stage.globalToLocal(stage.mouseX, stage.mouseY);
	brush.x = newPos.x;
	brush.y = newPos.y;

	if (!handContainer.hitTest(brush.x, brush.y)) painting = false;

	if (painting)
	{
		if (paintTimeElapsed == 0)
		{
			var brushSound = Math.random() < 0.75 ? 1 : 2;
			createjs.Sound.play("brush"+brushSound);
		}

		paintTimeElapsed += timeSinceLastTick;

		if (paintTimeElapsed < 250)
		{
			brush.image = queue.getResult("lid_"+brushColour+"_anim1");
		}
		else if (paintTimeElapsed < 500)
		{
			brush.image = queue.getResult("lid_"+brushColour);
		}
		else if (paintTimeElapsed < 750)
		{
			brush.image = queue.getResult("lid_"+brushColour+"_anim2");
		}
		else if (paintTimeElapsed < 1000)
		{
			brush.image = queue.getResult("lid_"+brushColour);
		}
		else
		{
			brush.image = queue.getResult("lid_"+brushColour+"_anim1");
			paintTimeElapsed = 0;
		}

		if (lastX && Math.abs(lastX - brush.x) < 10 && Math.abs(lastY - brush.y) < 10)
		{
			paint.graphics.beginStroke(getNailPolishColour())
				.setStrokeStyle(16, "round")
				.moveTo(lastX, lastY)
				.lineTo(brush.x, brush.y);
		}

		lastX = brush.x;
		lastY = brush.y;
	}
	else
	{
		lastX = null;
		lastY = null;
		paintTimeElapsed = 0;
		brush.image = queue.getResult("lid_"+brushColour);
	}

	stage.cursor = "none";
}

function getNailPolishColour()
{
	var colour;
	if (brushColour == "red") colour = "#e05151";
	if (brushColour == "orange") colour = "#cf6b1b";
	if (brushColour == "yellow") colour = "#e7d61a";
	if (brushColour == "green") colour = "#49a734";
	if (brushColour == "blue") colour = "#34a7a6";
	if (brushColour == "indigo") colour = "#346aa7";
	if (brushColour == "violet") colour = "#8689b9";
	return colour;
}

function finishNails()
{
	bgm.stop();
	bgm = null;
	createjs.Sound.play("paparazzi");

	stage.removeChild(brush);

	var n = Math.ceil(Math.random()*5);
	stockPhoto.image = queue.getResult("nails"+n);
	stockPhoto.alpha = 0;
	stage.addChild(stockPhoto)

	endTimeElapsed = 0;
	finished = true;
}
