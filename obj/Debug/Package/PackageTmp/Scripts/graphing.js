$(document).ready(function () {
    var barSpacing = 20,
	barWidth = 20,
	cvHeight = 220,
	xOffset = 20,
	maxVal = 0,
	gWidth = 500,
	gHeight = 550,
    divWidth = 0,
    divHeight = 560,
    startingLabel = 14,
    sDate,
    fDate,
    realStartDate,
    realFinishDate,
    dropdownMonths,
    getStart;

    // label arrays
    var gValues = [];
    var xLabels = [];
    var yLabels = [];
    var bLabels = [];
    var eLabels = [];
    var tLabels = [];
    var milestoneValues = [];
    var eventData = [];
    var eventLabels = [];

    // Canvas Variables
    var cv, ctx;

    $('#timeframo').change(function () {
        runMethods();
    });

    initCanvas();
    ctx.font = "bold 14px san-serif";
    ctx.save();
    setRealDateValues();
    getParentDivDimensions();
    getData();
    getFirst();
    getLast();
    setupBLabels();
    drawGraph();
    drawBars();
    drawTasks();
    drawEvents();

    function clearCanvas() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.restore();
    }

    function zeroArrays() {
        gValues.length = 0;
        xLabels.length = 0;
        yLabels.length = 0;
        eLabels.length = 0;
        bLabels.length = 0;
        milestoneValues.length = 0;
        tLabels.length = 0;
        eventData.length = 0;
        eventLabels.length = 0;
    }

    function runMethods() {
        zeroArrays();
        startingLabel = 14;
        clearCanvas();
        initCanvas();
        setRealDateValues();
        getParentDivDimensions();
        getData();
        getFirst();
        getLast();
        setupBLabels();
        drawGraph();
        drawBars();
        drawTasks();
        drawEvents();
    }

    function setRealDateValues() {
        dropdownMonths = $("#timeframo").val();
        realFinishDate = new Date();
        realFinishDate.setMonth(realFinishDate.getMonth() + parseFloat(dropdownMonths));
        realFinishDate = realFinishDate.toDateString();
        realStartDate = new Date().toDateString();
    }

    function drawEvents() {
        var eventStart;
        var eventEnd;
        var eventName;
        var weeksBetween;
        var weeksBetweenGetStartAndEventStart;
        var spacing = getTextSpacing();
        var nameCount = 0;

        for (z = 0; z < eventData.length; z = z + 2) {

            //event name
            eventName = eventLabels[nameCount];
            nameCount++;

            //event start date
            eventStart = new Date(parseInt(eventData[z].substr(6)));

            //event end date
            eventEnd = new Date(parseInt(eventData[z + 1].substr(6)));

            //weeks between the starting point of the graphing (the current date) and 
            weeksBetweenGetStartAndEventStart = weeks_between(Date.parse(realStartDate), Date.parse(eventStart.toDateString()));

            //weeks between the start of the graph and the end of the event
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(eventEnd.toDateString()));

            //save the context
            ctx.save();

            //set the alpha so the event is partially transparent
            ctx.globalAlpha = 0.3;

            //fill it with a colour out of the array.
            ctx.fillStyle = "#bde7ba";

            //save the context
            ctx.save();

            //draw the event
            var startingPoint;
            if (Date.parse(eventStart.toDateString()) <= Date.parse(realStartDate))
                startingPoint = getStart;
            else
                startingPoint = getStart + weeksBetweenGetStartAndEventStart * spacing;


            ctx.fillRect(startingPoint, 0, (weeksBetween * spacing), divHeight - 100);

            ctx.fillStyle = "#000000";

            //save the context
            ctx.save();
            ctx.rotate(Math.PI / 2);

            ctx.fillText(eventName, 390 - eventName.trim().length, -(startingPoint) - 5);
            ctx.restore();
        }
    }

    //Need to adapt to handle updatedstart and finish dates
    function getFirst() {
        var count = yLabels.length;
        var first;
        for (i = 0; i <= count; i = i + 2) {
            if (!first || first < gValues[i]) {
                first = gValues[i];
            }
        }
        sDate = realStartDate;
    }

    function getLast() {
        var count = yLabels.length;
        var last;
        for (i = 1; i <= count; i = i + 2) {
            if (!last || gValues[i] > last) {
                last = gValues[i];
            }
        }
        fDate = realFinishDate;
    }

    function setupBLabels() {
        var count = weeks_between(Date.parse(sDate), Date.parse(fDate));
        var myDate = new Date(Date.parse(sDate));
        for (i = 0; i <= count; i++) {
            var thisDate = new Date(myDate.setDate(myDate.getDate() + 7));
            bLabels.push(thisDate.toDateString());
        }
    }

    function weeks_between(date1, date2) {
        // The number of milliseconds in one week
        var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
        // Convert both dates to milliseconds
        var date1_ms = new Date(date1).getTime();
        var date2_ms = new Date(date2).getTime();
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms);
        // Convert back to weeks and return weeks
        return difference_ms / ONE_WEEK;
    }

    function getParentDivDimensions() {
        //account for the padding offset
        divWidth = document.getElementById('main').offsetWidth - 75;
        document.getElementById("graph").width = divWidth;
        document.getElementById("graph").height = divHeight;
    }

    function getData() {
        getProjectData();
        getTaskData();
        getEventData();
    }

    function getProjectData() {
        $.ajax({
            async: false,
            url: "/Projects/GetProjectData",
            success: function (project) {
                for (i = 0; i < project.length; i++) {
                    yLabels.push(project[i].Name);
                    gValues.push(project[i].BaselineStart);
                    gValues.push(project[i].BaselineFinish);
                }
            }
        });
    }

    function getTaskData() {
        $.ajax({
            async: false,
            url: "/Projects/GetMilestoneData",
            success: function (task) {
                for (i = 0; i < task.length; i++) {
                    tLabels.push(task[i].Name);
                    milestoneValues.push(task[i].ProjectId);
                    milestoneValues.push(task[i].BaselineStart);
                    milestoneValues.push(task[i].BaselineFinish);
                }
            }
        });
    }

    function getEventData() {
        $.ajax({
            async: false,
            url: "/Events/GetEventData",
            success: function (event) {
                for (i = 0; i < event.length; i++) {
                    eventLabels.push(event[i].Name);
                    eventData.push(event[i].Start);
                    eventData.push(event[i].Finish);
                }
            }
        });
    }

    function drawBars() {
        var spacing = getTextSpacing();
        var yCounter = 0;
        ctx.fillStyle = "#1f7c07";
        ctx.save();
        var end;
        var weeksBetween;
        for (z = 1; z < gValues.length; z = z + 2) {

            end = gValues[z];
            end = new Date(parseInt(end.substr(6)));
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
            ctx.fillRect(getStart, yCounter, (weeksBetween * spacing), 40);
            yCounter = yCounter + 40;
        }
    }

    function GetRandomColour() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function drawTasks() {
        var spacing = getTextSpacing();
        var yCounter = 0;
        var xCounter = 0;
        var name, start, end, taskStart, weeksBetween;
        ctx.fillStyle = GetRandomColour();
        ctx.save();
        var numberOfProjects = tLabels.length;
        //alert("NumOfProjects " + numberOfProjects);
        //alert("NumOfTasksToDisplay " + milestoneValues.length);
        while (numberOfProjects != 0) {
            //alert("NumOfProjects " + numberOfProjects)
            xCounter++;
            start = new Date(parseInt(milestoneValues[xCounter].substr(6)));
            //alert(start);
            xCounter++;
            end = new Date(parseInt(milestoneValues[xCounter].substr(6)));
            xCounter++;
            if (Date.parse(start.toDateString()) <= Date.parse(realStartDate)) {
                taskStart = getStart;
                weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
                ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
            }
            else {
                taskStart = getStart + weeks_between(Date.parse(realStartDate), Date.parse(start.toDateString())) * spacing;
                //number of weeks between startdate and end date
                weeksBetween = weeks_between(Date.parse(start.toDateString()), Date.parse(end.toDateString()));
                ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
            }


            //xCounter = 1;
            yCounter = yCounter + 40;
            numberOfProjects--;
        }
        //need to get number of weeks between realstartdate and first task date for each task
        //need to get number of weeks for task 
        //draw task.


    }

    function initCanvas() {
        // Try to access the canvas element and throw an error if it isn't available
        cv = $("#graph").get(0);
        if (!cv)
        { return; }

        // Try to get a 2D context for the canvas and throw an error if unable to
        ctx = cv.getContext('2d');
        if (!ctx)
        { return; }
    }

    // Determine the distance between the horizontal text labels on the x-axis; 
    function getTextSpacing() {
        spacing = (gWidth / (dropdownMonths * 4)) * 2;
        return spacing;
    }

    function drawGraph() {
        var spacing = getTextSpacing();
        getStart = getDistanceOfText();
        ctx.strokeStyle = "#1f7c07";
        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.fillText(sDate, 468, -84);
        getTextSpacing();
        var z = -84 - spacing;
        for (k = 0; k < bLabels.length; k++) {
            ctx.fillText(bLabels[k].toString(), 468, z);
            z = z - spacing;
        }
        ctx.restore();
        drawLine(ctx, getStart, 0, getStart, divHeight);
        drawLine(ctx, 0, divHeight - 100, divWidth, divHeight - 100);
        ctx.restore();
    }

    function getDistanceOfText() {
        var longest = 0;
        for (i = 0; i < yLabels.length; i++) {
            ctx.fillText(yLabels[i], 5, startingLabel);
            startingLabel = startingLabel + 40;
            if (yLabels[i].length > longest) {
                longest = yLabels[i].length;
            }
        }
        return longest * 5.5;
    }

    function drawLine(contextO, startx, starty, endx, endy) {
        contextO.beginPath();
        contextO.moveTo(startx, starty);
        contextO.lineTo(endx, endy);
        contextO.closePath();
        contextO.stroke();
    }
});




       
