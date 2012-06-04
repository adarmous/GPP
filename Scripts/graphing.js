//Graphing Library for the Graphical Project Portfolio
//Written by Adam O'Brien

$(document).ready(function () {
    var 
    //default width of 0
        divWidth = 0,
    //default height of 560
        divHeight = 560,
    //would be 22.5 but have to account for the border.
        startingLabel = 23.5,
        textStart = 468,
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

    $('#timeframo').change(function () {
        runMethods();
    });

    $('#divisiono').change(function () {
        runMethods();
    });

    initCanvas();
    getSetData();
    getParentDivDimensions();
    drawGraph();

    function runMethods() {
        textStart = 468;
        divHeight = 560;
        startingLabel = 14;
        clearCanvas();
        initCanvas();
        //getParentDivDimensions();
        getSetData();
        getParentDivDimensions();
        drawGraph();
    }

    //Function to get the divWidth, set the canvas width and height
    function getParentDivDimensions() {
        //account for the padding offset
        divWidth = document.getElementById('main').offsetWidth - 75;
        document.getElementById("graph").width = divWidth;
        document.getElementById("graph").height = divHeight;
        document.getElementById("graph").style.width = divWidth;
        document.getElementById("graph").style.height = divHeight;
    }

    //Function to draw events
    function drawEvents() {
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
            eventName = eventLabels[nameCount];
            nameCount++;
            eventStart = new Date(parseInt(eventData[z].substr(6)));
            eventEnd = new Date(parseInt(eventData[z + 1].substr(6)));
            weeksBetweenGetStartAndEventStart = weeks_between(Date.parse(realStartDate), Date.parse(eventStart.toDateString()));
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(eventEnd.toDateString()));


            if (isDateLessThanDate(Date.parse(realStartDate), Date.parse(eventStart.toDateString()), "drawEventsFirstIf")) {
                if (isDateLessThanDate(Date.parse(eventEnd.toDateString()), Date.parse(realStartDate), "drawEventsSecondIf")) {
                    dontWorry = 1;
                }
                else {
                    startingPoint = getStart + 1;
                    weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(eventEnd.toDateString()));
                    dontWorry = 0;
                }
            }
            else {
                startingPoint = getStart + 1 + weeksBetweenGetStartAndEventStart * spacing;
                dontWorry = 0;
            }

            if (dontWorry == 0 || dontWorry < 1) {
                ctx.fillRect(startingPoint, 0, (weeksBetween * spacing), divHeight - 100);
                ctx.save();
                ctx.rotate(Math.PI / 2);
                if (weeksBetween >= 0.5) {
                    ctx.fillStyle = "#000000";
                    ctx.fillText(eventName, ((divHeight - 105) - ctx.measureText(eventName).width), -(startingPoint + 1 + weeksBetween * spacing) + 10);
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
        var end;
        var weeksBetween;
        var weeksBetweenGraphStartAndFinish = weeks_between(Date.parse(realStartDate), Date.parse(realFinishDate));
        for (z = 1; z < gValues.length; z = z + 2) {
            ctx.strokeStyle = "#efefef";
            ctx.globalAlpha = 0.3;
            ctx.save();
            end = gValues[z];
            end = new Date(parseInt(end.substr(6)));
            weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
            alert(realStartDate + " " + end.toDateString() + " " + weeksBetween);
            ctx.fillRect((getStart + 1), yCounter, (weeksBetween * spacing), 40);
            yCounter = yCounter + 45;
            ctx.save();
            ctx.strokeStyle = "#aeddcd";
            ctx.save();
            ctx.rotate(Math.PI / 2);
            if (weeksBetween != false) {
                if (weeksBetween < weeksBetweenGraphStartAndFinish - 2.6) {
                    ctx.fillText((end.getDate() + "/" + (end.getMonth() + 1) + "/" + (parseInt(end.getFullYear().toString()) - 2000)), yCounter - 42, -((getStart - 8) + weeksBetween * spacing));
                }
                else {
                    ctx.fillText((end.getDate() + "/" + (end.getMonth() + 1) + "/" + (parseInt(end.getFullYear().toString()) - 2000)), yCounter - 40, -divWidth + 10);
                }
            }
            ctx.restore();
        }
    }

    //function to draw tasks
    function drawTasks() {
        if (milestoneValues.length > 0) {
            var spacing = getTextSpacing();
            var yCounter = 1;
            var xCounter = 0;
            var nameCounter = 0;
            var name, start, end, taskStart, weeksBetween;
            var currentId = 0;
            var nextId = 0;
            var zCounter = 0;
            var name = "";
            //alert("here in projectlength world" + milestonePerProject.length);
            for (c = 0; c < milestonePerProject.length; c++) {
                //alert("this is c: " + c);
                for (b = 0; b < milestonePerProject[c]; b++) {
                    //alert("this is b(inside loop): " + b + " this is c: " + c);
                    //alert(c + " " + b);
                    ctx.fillStyle = taskColours[nameCounter];
                    name = tLabels[nameCounter];
                    nameCounter++;
                    xCounter++;
                    start = new Date(parseInt(milestoneValues[xCounter].substr(6)));
                    xCounter++;
                    end = new Date(parseInt(milestoneValues[xCounter].substr(6)));
                    xCounter++;
                    if (Date.parse(start.toDateString()) <= Date.parse(realStartDate)) {
                        taskStart = getStart;
                        weeksBetween = weeks_between(Date.parse(realStartDate), Date.parse(end.toDateString()));
                        ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(name, taskStart, yCounter + 20);
                    }
                    else {
                        taskStart = getStart + weeks_between(Date.parse(realStartDate), Date.parse(start.toDateString())) * spacing;
                        weeksBetween = weeks_between(Date.parse(start.toDateString()), Date.parse(end.toDateString()));
                        ctx.fillRect(taskStart, yCounter, (weeksBetween * spacing), 40);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(name, taskStart, yCounter + 20);
                    }

                }
                yCounter = yCounter + 45;
            }
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
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#000000";
        ctx.save();
        drawLine(ctx, getStart, 0, getStart, divHeight);
        drawLine(ctx, 0, divHeight - 100, divWidth, divHeight - 100);

        drawBars();
        drawTasks();
        drawEvents();
    }

    /*Control Functions*/

    //Get data for projects, tasks and events
    function getSetData() {
        setRealDateValues();
        getProjectData();
        getTaskData();
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
        //find jquery way to do this
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
                    if (dropdownDivision == project[i].OwnerName || dropdownDivision == "ALL") {
                        yLabels.push(project[i].Name);
                        gValues.push(project[i].BaselineStart);
                        gValues.push(project[i].BaselineFinish);
                        ownerValues.push(project[i].OwnerName);
                    }
                }
            }
        });
        if (yLabels.length > 10) {
            divHeight = divHeight + (yLabels.length - 10) * 45;
            textStart = parseInt(textStart.toString()) + (yLabels.length - 10) * 45;
        }
    }

    function ArrayContains(value) {
        return true;
    }

    //function to return task data
    function getTaskData() {
        var xCounter = 0;
        var lastId = 0;
        var currentId = 0;
        $.ajax({
            async: false,
            url: "../Projects/GetMilestoneData",
            success: function (task) {
                for (i = 0; i < task.length; i++) {
                    tLabels.push(task[i].Name);
                    milestoneValues.push(task[i].ProjectId);
                    milestoneValues.push(task[i].BaselineStart);
                    milestoneValues.push(task[i].BaselineFinish);
                    taskColours.push(task[i].Colour);

                    xCounter++;

                    //i == 0
                    //i == task.length - 1


                    if (task.length != 0) {
                        if (task.length - 1 > i) {
                            if (task[i].ProjectId != task[i + 1].ProjectId) {
                                milestonePerProject.push(xCounter);
                                xCounter = 0;
                            }
                            else {
                                //do nothing as there is another one like this and will be picked up in the next loop cycle
                            }
                        }
                        else {
                            //task length is 1 and its the only one you have to push on.
                            milestonePerProject.push(xCounter);
                            xCounter = 0;
                        }
                    }




                    /* if (task[i].ProjectId != lastId && i != 0) {
                    milestonePerProject.push(xCounter);
                    xCounter = 0;
                    }

                    if (i == 0 && task.length - 1 != i) {
                    if (task.length > 1) {
                    if (task[i].ProjectId != task[i + 1].ProjectId) {
                    milestonePerProject.push(xCounter);
                    xCounter = 0;
                    }
                    }
                    }

                    if (task.length - 1 == i && counter != 0) {
                    milestonePerProject.push(xCounter);
                    xCounter = 0;
                    }
                    */

                    lastId = task[i].ProjectId;
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
                    //alert(event[i].Colour);
                }
            }
        });
    }

    /*Core Functions*/

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
        var curr_year2 = date22.getFullYear(); //alert("days: " + curr_date1 + " " + curr_date2 + " months: " + curr_month1 + " " + curr_month2 + " years: " + curr_year1 + " " + curr_year2);

        if (parseInt(curr_year1) < parseInt(curr_year2)) {
            return true;
        }
        else {
            if (parseInt(curr_month1) < parseInt(curr_month2)) {
                return true;
            }
            else {
                if (parseInt(curr_date1) < parseInt(curr_date2)) {
                    return true;
                }
                else {
                    //alert(when + " " + parseInt(curr_date1) + " > " + parseInt(curr_date2) + " " + date22 + " " + date2);
                    return false;
                }
            }
        }
    }



    //Function to return a random colour
    function GetRandomColour() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
    }


});