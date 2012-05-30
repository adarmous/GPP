$(function () {


        var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];



        $.plot($("#placeholder"), [
                
                {
                    data: d2,
                    bars: {
                    horizontal: true,
                    show:true
                    }
            },
            {
                xaxis: {
                    show: true,
                    position: "bottom",
                    mode: "time"
                }}
    ]);

        //function to return project data
        function getProjectData() {
            $.ajax({
                async: false,
                url: "../Projects/GetProjectData",
                success: function (project) {
                    for (i = 0; i < project.length; i++) {
                        yLabels.push(project[i].Name);
                        gValues.push(project[i].BaselineStart);
                        gValues.push(project[i].BaselineFinish);
                    }
                }
            });
            if (yLabels.length > 10) {
                //why 45?
                divHeight = divHeight + (yLabels.length - 10) * 45;
                textStart = parseInt(textStart.toString()) + (yLabels.length - 10) * 45;
            }
        }

        //function to return task data
        function getTaskData() {
            $.ajax({
                async: false,
                url: "../Projects/GetMilestoneData",
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
                    }
                }
            });
        }



    });
