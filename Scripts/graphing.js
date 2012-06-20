//Graphing Library for the Graphical Project Portfolio
//Written by Adam O'Brien
//where the f is it.

$(document).ready(function () {
    var 
    //default width of 0
        divWidth = 0,
    //default height of 560
        divHeight = 560,
    //would be 22.5 but have to account for the border.
        startingLabel = 23.5,
        textStart = 465,
        realStartDate,
        realFinishDate,
        dropdownMonths,
        getStart,
        dropdownDivision;

    // label arrays
    var gValues = [];
    var xLabels = [];
    var yLabels = [];
    var bLabels = [];
    var eLabels = [];
    var projids = [];
    var ownerValues = [];
    var milestonePerProject = [];
    var tLabels = [];
    var milestoneValues = [];
    var taskColours = [];
    var eventColours = [];
    var eventData = [];
    var eventLabels = [];

    // Canvas Variables
    var cv, ctx;

    //events
    $('#timeframo').change(function () {
        runMethods();
    });

    $('#divisiono').change(function () {
        runMethods();
    });

    $(window).resize(function () {
        runMethods();
    });


    initCanvas();
    getSetData();
    getParentDivDimensions();
    drawGraph();

    function runMethods() {
        textStart = 465;
        divHeight = 560;
        startingLabel = 14;
        clearCanvas();
        initCanvas();
        getSetData();
        getParentDivDimensions();
        drawGraph();
    }

    //Function to get the divWidth, set the canvas width and height
    function getParentDivDimensions() {
        //account for the padding offset
        //alert("before" + divWidth);
        if (divWidth == 0) {
            divWidth = document.getElementById('main').offsetWidth - 75;
        }
        document.getElementById("graph").width = divWidth;
        document.getElementById("graph").height = divHeight;
        document.getElementById("graph").style.width = divWidth;
        document.getElementById("graph").style.height = divHeight;
        //alert("after" + document.getElementById("graph").width);
        ctx.font = '9px Verdana';
    }

    //Function to draw events
    function drawEvents() {
        ctx.globalAlpha = 0.2;
        var eventStart;
        var eventEnd;
        var eventName;
        var weeksBetween;
        var weeksBetweenGetStartAndEventStart;
        var spacing = getTextSpacing();
        var dontWorry = 0;
        var nameCount = 0;
        var startingPoint = 0;

        for (z = 0; z < eventData.length; z = z + 2) {

            ctx.fillStyle = eventColours[nameCount];
            ctx.save();

            eventName = eventLabels[nameCount];

            nameCount++;

            eventStart = new Date(parseInt(eventData[z].substr(6)));
            eventEnd = new Date(parseInt(eventData[z + 1].substr(6)));

            weeksBetweenGetStartAndEventStart = weeks_between(Date.parse(realStartDate), Date.parse(eventStart.toDateString()));
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(eventEnd.toDateString()));

            //if current date (realStartDate) < Event Start)
            if (isDateLessThanDate(Date.parse(realStartDate), Date.parse(eventStart.toDateString()), "drawEventsFirstIf")) {
                startingPoint = getStart + 1 + (weeksBetweenGetStartAndEventStart * spacing);
                weeksBetween = weeks_between(Date.parse(eventStart.toDateString()), Date.parse(eventEnd.toDateString()));

                dontWorry = 0;
            }
            else {
                //6/7 < 17/6
                if (isDateLessThanDate(Date.parse(eventEnd.toDateString()), Date.parse(realStartDate), "ballSoup")) {
                    dontWorry = 1;
                    //alert(eventEnd.toDateString() + " < " + realStartDate);
                }
                else {
                    //alert(eventName + " " + "here");
                    startingPoint = getStart + 1;
                    weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(eventEnd.toDateString()));
                    dontWorry = 0;
                }
            }

            if (dontWorry == 0) {
                ctx.fillRect(startingPoint, 0, (weeksBetween * spacing), divHeight - 100);
                ctx.save();
                ctx.rotate(Math.PI / 2);
                if (weeksBetween >= 0.5) {
                    ctx.fillStyle = "#000000";
                    ctx.globalAlpha = 1.0;
                    ctx.fillText(eventName, 5, -(startingPoint + 1 + weeksBetween * spacing) + 10);
                    ctx.fillText(eventName, ((divHeight - 105) - ctx.measureText(eventName).width), -(startingPoint + 1 + weeksBetween * spacing) + 10);
                    //ctx.globalAlpha = 0.2;
                }
                ctx.restore();
                ctx.save();
            }
            dontWorry = 0;
        }
    }

    //Function to setup Y axis labels
    function setupYAxisLabels() {
        var count = weeks_between(Date.parse(realStartDate), Date.parse(realFinishDate));
        var myDate = new Date(Date.parse(realStartDate));
        for (i = 0; i <= count; i++) {
            var thisDate = new Date(myDate.setDate(myDate.getDate() + 7));
            bLabels.push(thisDate.toDateString());
        }
    }

    //function to draw projects
    function drawBars() {

        var spacing = getTextSpacing();
        //the border counts as a 1
        var yCounter = 1;
        var cCounter = 1;
        var barCounter = 0;
        var end;
        var start;
        var conter = 0;
        var weeksBetween;
        var startingPoint;
        var projectIdCount = 0;

        var weeksBetweenGraphStartAndFinish = weeks_between(Date.parse(realStartDate), Date.parse(realFinishDate));
        var weeksBetweenGetStartAndProjectStart;
        for (z = 1; z < gValues.length; z = z + 2) {

            ctx.globalAlpha = 0.2;
            ctx.save();
            start = gValues[z - 1];
            start = new Date(parseInt(start.substr(6)));
            end = gValues[z];
            end = new Date(parseInt(end.substr(6)));
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
            weeksBetweenGetStartAndProjectStart = weeks_between(Date.parse(realStartDate), Date.parse(start.toDateString()));


            if (isDateLessThanDate(Date.parse(realStartDate), Date.parse(start.toDateString()), "drawBarz")) {
                startingPoint = getStart + 1 + (weeksBetweenGetStartAndProjectStart * spacing);
            }
            else {
                startingPoint = getStart + 1;
            }

            ctx.fillRect(startingPoint, yCounter, (weeksBetween * spacing), 40);
            yCounter = yCounter + 45;
            ctx.rotate(Math.PI / 2);
            if (weeksBetween != false) {
                if (weeksBetween < weeksBetweenGraphStartAndFinish - 1.6) {
                    ctx.globalAlpha = 1;
                    ctx.fillText((end.getDate() + "/" + (end.getMonth() + 1) + "/" + (parseInt(end.getFullYear().toString()) - 2000)), yCounter - 45, -((startingPoint - 8) + weeksBetween * spacing));
                    ctx.globalAlpha = 0.2;
                }
                else {
                    ctx.globalAlpha = 1;
                    ctx.fillText((end.getDate() + "/" + (end.getMonth() + 1) + "/" + (parseInt(end.getFullYear().toString()) - 2000)), yCounter - 45, -divWidth + 10);
                    ctx.globalAlpha = 0.2;
                }
            }
            ctx.restore();

            if (weeksBetween != false) {
                if (projids[projectIdCount] != undefined) {

                    drawTasksForBar(cCounter, projids[projectIdCount]);
                    milestoneValues.length = 0;
                }
            }

            projectIdCount = projectIdCount + 1;
            cCounter = cCounter + 45;
        }
    }

    //function to draw tasks
    function drawTasksForBar(yCounter, id) {
        getTaskDataForProject(id);
        ctx.globalAlpha = 1.0;
        var spacing = getTextSpacing();
        var xCounter = 0;
        var nameCounter = 0;
        var name, start, end, taskStart, weeksBetween;

        var zCounter = 0;
        var name = "";

        for (b = 0; b < milestoneValues.length / 5; b++) {

            name = milestoneValues[xCounter];
            xCounter++;
            xCounter++;
            start = new Date(parseInt(milestoneValues[xCounter].substr(6)));
            xCounter++;
            end = new Date(parseInt(milestoneValues[xCounter].substr(6)));
            xCounter++;
            ctx.fillStyle = milestoneValues[xCounter];
            alert(milestoneValues[xCounter]);

            if (milestoneValues.length > b + 1) {
                xCounter++;
            }

            if (Date.parse(start.toDateString()) <= Date.parse(realStartDate)) {
                taskStart = getStart + 1;
                weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
                ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 1.0;
                ctx.fillText(name, taskStart + 2, yCounter + 20);
            }
            else {
                taskStart = getStart + 1 + weeks_between(Date.parse(realStartDate), Date.parse(start.toDateString())) * spacing;
                weeksBetween = weeks_between(Date.parse(start.toDateString()), Date.parse(end.toDateString()));
                ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 1.0;
                ctx.fillText(name, taskStart + 2, yCounter + 20);
            }
            //restore();
        }
    }

    //main draw graph function
    function drawGraph() {

        setupYAxisLabels();
        getStart = getDistanceOfText();
        var spacing = getTextSpacing();
        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.fillText(realStartDate, parseInt(textStart.toString()), -(getStart + 1));
        var z = -(getStart + 1) - spacing;

        for (k = 0; k < bLabels.length; k++) {

            ctx.fillText(bLabels[k].toString(), parseInt(textStart.toString()), z);
            z = z - spacing;
        }

        ctx.restore();
        ctx.globalAlpha = 2.0;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.4;
        ctx.save();
        drawLine(ctx, getStart, 0, getStart, divHeight);
        drawLine(ctx, 0, divHeight - 100, divWidth, divHeight - 100);

        ctx.font = '8.5px Verdana';

        drawBars();
        drawEvents();
    }

    /*Control Functions*/

    //Get data for projects, tasks and events
    function getSetData() {
        setRealDateValues();
        getProjectData();
        getEventData();
    }

    /*Initialisation Functions*/

    //Intialise Canvas
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

    /*Data Functions*/
    function setRealDateValues() {
        dropdownMonths = $("#timeframo").val();
        dropdownDivision = $("#divisiono option:selected").text().toUpperCase();
        realStartDate = new Date().toDateString();
        realFinishDate = new Date();
        realFinishDate.setMonth(realFinishDate.getMonth() + parseFloat(dropdownMonths));
        realFinishDate = realFinishDate.toDateString();
    }

    //function to return project data
    function getProjectData() {
        $.ajax({
            async: false,
            url: "../Projects/GetProjectData",
            success: function (project) {
                for (i = 0; i < project.length; i++) {
                    projids.push(project[i].Id);
                    yLabels.push(project[i].Name);
                    gValues.push(project[i].BaselineStart);
                    gValues.push(project[i].BaselineFinish);
                    ownerValues.push(project[i].OwnerName);
                }
            }
        });
        if (yLabels.length > 10) {
            divHeight = divHeight + (yLabels.length - 10) * 45;
            textStart = parseInt(textStart.toString()) + (yLabels.length - 10) * 45;
        }
    }

    //Get Milestone Tasks for an individual Project
    function getTaskDataForProject(id) {
        var stringo = "../Projects/GetMilestoneDataForProject/" + id;
        $.ajax({
            async: false,
            url: stringo,
            success: function (task) {
                for (i = 0; i < task.length; i++) {

                    milestoneValues.push(task[i].Name); //0 5
                    milestoneValues.push(task[i].ProjectId); //1 6 
                    milestoneValues.push(task[i].BaselineStart); //2
                    milestoneValues.push(task[i].BaselineFinish); //3
                    milestoneValues.push(task[i].Colour); //4
                }
            }
        });

    }

    //function return event data
    function getEventData() {
        $.ajax({
            async: false,
            url: "../Events/GetEventData",
            success: function (event) {
                for (i = 0; i < event.length; i++) {
                    eventLabels.push(event[i].Name);
                    eventData.push(event[i].Start);
                    eventData.push(event[i].Finish);
                    eventColours.push(event[i].Colour);
                }
            }
        });
    }

    //Function to draw a line
    function drawLine(contextO, startx, starty, endx, endy) {
        contextO.beginPath();
        contextO.moveTo(startx, starty);
        contextO.lineTo(endx, endy);
        contextO.closePath();
        contextO.stroke();
    }

    /*Utility Functions*/

    //function to obtain the length of the text so that the Y axis can be placed in the correct location.
    function getDistanceOfText() {
        var longest = 0;
        for (i = 0; i < yLabels.length; i++) {
            ctx.fillText(yLabels[i], 4, startingLabel);
            startingLabel = startingLabel + 45;
            if (ctx.measureText(yLabels[i].toString()).width > longest) {
                longest = ctx.measureText(yLabels[i].toString()).width;
            }
        }
        //return with an extra 9 units of space to account for starting 4 from the border (0) (the border is also 1 unit as well)
        //and give 5 units of space padding before the border so the text looks neat and not pressed up against it.
        return longest + 9;
    }

    // Function to determine the distance between the horizontal text labels on the x-axis;
    function getTextSpacing() {
        spacing = (divWidth / (dropdownMonths * 4.348));
        return spacing;
    }

    //Function to determine the numbers of weeks between two dates
    function weeks_between(date1, date2) {
        if (date1 <= date2) {
            if (isDateLessThanDate(date1, date2, "WeeksBetween")) {
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
            else {

                return false;
            }
        }
        else {
            return false;
        }
    }

    //Function to determine if one date is less then another date
    function isDateLessThanDate(date1, date2, when) {
        var date12 = new Date(date1);
        var date22 = new Date(date2);
        var curr_date1 = date12.getDate();
        var curr_month1 = date12.getMonth() + 1;
        var curr_year1 = date12.getFullYear();
        var curr_date2 = date22.getDate();
        var curr_month2 = date22.getMonth() + 1;
        var curr_year2 = date22.getFullYear();

        if (when == "ballSoup") {
            //alert("years: " + curr_year1 + "<" + curr_year2 + " months: " + curr_month1 + "<" + curr_month2);
        }

        if (parseInt(curr_year1) < parseInt(curr_year2)) {
            return true;
        }
        else if (parseInt(curr_year1) > parseInt(curr_year2)) {
            return false;
        }
        else {
            if (parseInt(curr_month1) < parseInt(curr_month2)) {
                return true;
            }
            else if (parseInt(curr_month1) > parseInt(curr_month2)) {
                return false;
            }
            else {
                if (parseInt(curr_date1) <= parseInt(curr_date2)) {
                    return true;
                }
                else {
                    //alert(when + " " + parseInt(curr_date1) + " > " + parseInt(curr_date2) + " " + date22 + " " + date2);
                    return false;
                }
            }
        }
    }

    /*Reset Functions*/

    //function to clear the canvas
    function clearCanvas() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.restore();
        gValues.length = 0;
        xLabels.length = 0;
        yLabels.length = 0;
        eLabels.length = 0;
        ownerValues.length = 0;
        bLabels.length = 0;
        milestoneValues.length = 0;
        tLabels.length = 0;
        eventData.length = 0;
        eventLabels.length = 0;
        milestonePerProject.length = 0;
        taskColours.length = 0;
        eventColours.length = 0;
        projids = [];
    }


});