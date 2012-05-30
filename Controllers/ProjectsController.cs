using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GPP.Library;

namespace GPP.Controllers
{
    public class ProjectsController : Controller
    {
        public IProjectService Projects { get; set; }
        public IMilestoneService Tasks { get; set; }
        public ITimeframesService Timeframes { get; set; }
        public IDivisionService Divisions { get; set; }

        public ProjectsController()
        {
            if (Projects == null) { Projects = new ProjectService(); }
            if (Tasks == null) { Tasks = new MilestoneService(); }
            if (Timeframes == null) { Timeframes = new TimeframesService(); }
            if (Divisions == null) { Divisions = new DivisionService(); }
            base.Initialize(new System.Web.Routing.RequestContext());
        }

        //Display all projects and events on a common timescale
        public ActionResult Index()
        {
            ViewBag.Timeframez = new SelectList(Timeframes.GetAllTimeframes(), "Months", "Name", Timeframes.GetDefaultTimeframe().ToString());
            ViewBag.Divisionz = new SelectList(Divisions.GetAllDivisions(true), "Id", "Name", Divisions.GetSelectedDefault().ToString());
            
            return View();
        }

        public ActionResult AllOpenProjects()
        {
            var projects = Projects.GetAllOpenProjects();
            return View(projects);
        }

        public ActionResult AllTimeframes()
        {
            var timeframes = Timeframes.GetAllTimeframes();
            return View(timeframes);
        }

        public ActionResult AllClosedProjects()
        {
            var projects = Projects.GetAllClosedProjects();
            return View(projects);
        }

        public JsonResult GetProjectData()
        {
            var projs = Projects.GetAllOpenProjects();
            return Json(projs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMilestoneData()
        {
            var tasks = Tasks.GetAllTasksForOpenProjects();
            return Json(tasks, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AddTimeframe()
        {
            return View();
        }

        [HttpPost]
        public ActionResult AddTimeframe(TimeframesViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Timeframes.AddTimeframe(model);
                return RedirectToAction("AllTimeframes");
            }
        }

        //Delete a project from the system 
        public ActionResult DeleteTimeframe(string id)
        {
            Timeframes.DeleteTimeframe(id);
            return RedirectToAction("AllTimeframes");
        }

        //Add a project to the system
        public ActionResult AddProject()
        {
            ViewBag.Divisionz = new SelectList(Divisions.GetAllDivisions(false), "Id", "Name");
            return View();
        }

        private void DivisionUp()
        {
            
        }

        [HttpPost]
        public ActionResult AddProject(ProjectViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Projects.AddProject(model);
                return RedirectToAction("AllOpenProjects");
            }
        }

        //Delete a project from the system 
        public ActionResult DeleteProject(string id)
        {
            Projects.DeleteProject(id);
            return RedirectToAction("AllOpenProjects");
        }

        //Edit a project in the system
        public ActionResult EditProject(string id)
        {
            var project = SetupEditProject(id);
            return View(project);
        }

        private ProjectViewModel SetupEditProject(string id)
        {
            var project = Projects.GetProject(id);
            ViewBag.Divisionz = new SelectList(Divisions.GetAllDivisions(false), "Id", "Name", project.Owner.ToString());
            return project;
        }

        [HttpPost]
        public ActionResult EditProject(ProjectViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var project = SetupEditProject(model.Id.ToString());
                return View(project);
            }
            else
            {
                Projects.EditProject(model);
                return RedirectToAction("AllOpenProjects");
            }
        }

        public ActionResult AllMilestones(string id)
        {
            var milestones = Tasks.GetTasksForProject(id);
            ViewBag.Id = id;
            return View(milestones);
        }

        //Add a task to a project
        public ActionResult AddMilestoneToProject(string id)
        {
            ViewBag.Id = id;
            return View();
        }

        [HttpPost]
        public ActionResult AddMilestoneToProject(int id, MilestoneViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                model.ProjectId = id;
                Tasks.AddTaskForProject(model);
                return RedirectToAction("AllMilestones", "Projects", new { id = id });
            }
        }

        //Delete a task from a project
        public ActionResult DeleteMilestoneFromProject(string id)
        {
            return RedirectToAction("AllMilestones", "Projects", new { id = id });
        }

        //Edit a specific task
        //Edit a project in the system
        public ActionResult EditMilestone(string id)
        {
            return View(Tasks.GetTask(id));
        }

        [HttpPost]
        public ActionResult EditMilestone(MilestoneViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Tasks.EditTask(model);
                return RedirectToAction("AllMilestones", "Projects", new { id = model.ProjectId });
            }
        }
    }
}
