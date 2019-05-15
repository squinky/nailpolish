var salonbg;
var brush, brushColour, painting, paintTimeElapsed;
var bottles = [];

function initSalon()
{
	salonbg = new createjs.Bitmap(queue.getResult("main_background"));

	brush = new createjs.Bitmap(queue.getResult("lid_red"));
	brush.regX = brush.getBounds().width/2;
	brush.regY = brush.getBounds().height*3/4;
	brush.scaleX = 0.5;
	brush.scaleY = 0.5;
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
		bottles[i].scaleX = 0.5;
		bottles[i].scaleY = 0.5;
		bottles[i].x = 200*i;
		bottles[i].y = ACTUAL_HEIGHT - 300;
	}
}

function addBottle(c)
{
	var newBottle = new createjs.Bitmap(queue.getResult("bottle_"+c));
	newBottle.colour = c;

	newBottle.on("click", function(evt) { brushColour = evt.target.colour; });

	bottles.push(newBottle);
}

function enterSalon()
{
	currentScreen = SCREEN_SALON;

	stage.addChild(salonbg);

	for (var i = 0; i < bottles.length; i++)
	{
		stage.addChild(bottles[i]);
	}

	stage.addChild(brush);

	stage.on("mousedown", function(evt) { painting = true; });
	stage.on("stagemouseup", function(evt) { painting = false; });

	brushColour = "red";
	painting = false;
}

function updateSalon(timeSinceLastTick)
{
	var newPos = stage.globalToLocal(stage.mouseX, stage.mouseY);
	brush.x = newPos.x;
	brush.y = newPos.y;

	if (painting)
	{
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
	}
	else
	{
		paintTimeElapsed = 0;
		brush.image = queue.getResult("lid_"+brushColour);
	}
	stage.cursor = "none";
}
