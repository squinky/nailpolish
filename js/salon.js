var salonbg, hand, paint, brush, brushColour, painting, paintTimeElapsed, lastX, lastY;
var bottles = [];

function initSalon()
{
	salonbg = new createjs.Bitmap(queue.getResult("main_background"));

	hand = new createjs.Bitmap(queue.getResult("hand1"));
	hand.x = 150;
	hand.y = -50;

	paint = new createjs.Shape();
	paint.mouseEnabled = false;

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

	bottomBox = new createjs.Shape();
	bottomBox.graphics.beginFill("#000000").drawRect(0, ACTUAL_HEIGHT, ACTUAL_WIDTH, 400);

	hand.on("mousedown", function(evt) { painting = true; });
	hand.on("pressmove", function(evt) { painting = true; });
	stage.on("stagemouseup", function(evt) { painting = false; });
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
	stage.addChild(hand);
	stage.addChild(paint);

	for (var i = 0; i < bottles.length; i++)
	{
		stage.addChild(bottles[i]);
	}

	stage.addChild(bottomBox);
	stage.addChild(brush);

	brushColour = "red";
	painting = false;

	bgm = createjs.Sound.play("salon", { loop: -1 });
}

function updateSalon(timeSinceLastTick)
{
	var newPos = stage.globalToLocal(stage.mouseX, stage.mouseY);
	brush.x = newPos.x;
	brush.y = newPos.y;

	if (!hand.hitTest(brush.x-hand.x, brush.y-hand.y)) painting = false;

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
