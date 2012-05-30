using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GPP.Library;

namespace GPP.Controllers
{
    public class TasksController : Controller
    {

        public IGlobalEventService Events { get; set; }
        public ITypeService Types { get; set; }

        public TasksController()
        {
            if (Events == null) { Events = new GlobalEventService(); }
            if (Types == null) { Types = new TypeService(); }
            base.Initialize(new System.Web.Routing.RequestContext());
        }

        public JsonResult GetEventData()
        {
            var evs = Events.GetAllEvents();
            if (evs.Count > 0)
            {
                Console.Write("Over");
            }
            //Events.WriteToLog(evs.Count.ToString());
            return Json(evs, JsonRequestBehavior.AllowGet);
        }

        //List all events
        public ActionResult Index()
        {
            ViewBag.Message = "Welcome to the Graphical Project Portfolio (GPP)";
            return View();
        }

        public ActionResult AllEvents()
        {
            var events = Events.GetAllEvents();
            return View(events);
        }

        //Add a new event
        public ActionResult AddEvent()
        {
            ViewBag.Tyypes = new SelectList(Types.GetAllTypes(), "Id", "Name");
            return View();
        }

        [HttpPost]
        public ActionResult AddEvent(GlobalEventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Events.AddEvent(model);
                return RedirectToAction("AllEvents", "Events", new { id = model.Id });
            }
        }

        public ActionResult DeleteEvent(string id)
        {
            Events.DeleteEvent(id);
            return RedirectToAction("AllEvents");
        }

        //Event an event
        public ActionResult EditEvent(string id)
        {
            ViewBag.Tyypes = new SelectList(Types.GetAllTypes(), "Id", "Name", Types.GetTyype(Events.GetEvent(id).EventTypeId.ToString()).Id);
            return View(Events.GetEvent(id));
        }

        [HttpPost]
        public ActionResult EditEvent(GlobalEventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Events.EditEvent(model);
                return RedirectToAction("AllEvents", "Events", new { id = model.Id });
            }
        }

        //Add a new event
        public ActionResult AddType()
        {
            return View();
        }

        public ActionResult AllTypes()
        {
            var events = Types.GetAllTypes();
            return View(events);
        }

        [HttpPost]
        public ActionResult AddType(TypeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            else
            {
                Types.AddType(model);
                return RedirectToAction("AllEventTypes", "Events");
            }
        }

        //Delete an event
        public ActionResult DeleteType(string id)
        {
            Types.DeleteType(id);
            return RedirectToAction("AllEventTypes");
        }
    }
}
