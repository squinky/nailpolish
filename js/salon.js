var salonbg;
var brush, brushColour, painting, paintTimeElapsed;

function initSalon()
{
	salonbg = new createjs.Bitmap(queue.getResult("main_background"));

	brush = new createjs.Bitmap(queue.getResult("lid_red"));
	brush.regX = brush.getBounds().width/2;
	brush.regY = brush.getBounds().height*3/4;
	brush.scaleX = 0.5;
	brush.scaleY = 0.5;
}

function enterSalon()
{
	currentScreen = SCREEN_SALON;

	stage.addChild(salonbg);
	stage.addChild(brush);

	stage.on("stagemousedown", function(evt) { painting = true; });
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
