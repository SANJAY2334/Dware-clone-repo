import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [editingEvent, setEditingEvent] = useState(null);

  
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://dwareautomator.mresult.com/api/schedular/GetSchedular", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgiLCJFbWFpbCI6InJhZ3NhbmpheTdAb3V0bG9vay5jb20iLCJuYmYiOjE3NDQxMDIyOTgsImV4cCI6MTc0NDEwNTg5OCwiaWF0IjoxNzQ0MTAyMjk4LCJpc3MiOiJodHRwczovL2R3YXJlYXV0b21hdG9yLm1yZXN1bHQuY29tOjQyMDAifQ.Rpm7FJB1EelOf3JaAtUhxa8j7o6xdH1v4RmBxdVhSIQ",
          },
        });
        const result = await res.json();
        if (Array.isArray(result)) {
          const mappedEvents = result.map((item, index) => ({
            id: String(index + 1),
            title: item.name || `Event ${index + 1}`,
            start: item.date || item.startDate || new Date().toISOString(), // Adjust based on actual response structure
            allDay: true,
          }));
          setEvents(mappedEvents);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    const fetchJobSummary = async () => {
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/schedular/GetJobSummary?category=all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgiLCJFbWFpbCI6InJhZ3NhbmpheTdAb3V0bG9vay5jb20iLCJuYmYiOjE3NDQxMDIyOTgsImV4cCI6MTc0NDEwNTg5OCwiaWF0IjoxNzQ0MTAyMjk4LCJpc3MiOiJodHRwczovL2R3YXJlYXV0b21hdG9yLm1yZXN1bHQuY29tOjQyMDAifQ.Rpm7FJB1EelOf3JaAtUhxa8j7o6xdH1v4RmBxdVhSIQ" ,
          },
        });
    
        const data = await response.json();
        console.log("Job Summary:", data);
      } catch (error) {
        console.error("Error fetching job summary:", error);
      }
    };

    fetchEvents();
    fetchJobSummary();
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return alert("Please fill in all fields");
    setEvents([...events, { id: String(events.length + 1), title: newEvent.title, start: newEvent.date }]);
    setNewEvent({ title: "", date: "" });
  };

  const handleEventClick = ({ event }) => {
    setEditingEvent({ id: event.id, title: event.title, start: event.startStr });
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    setEvents(events.map(evt => (evt.id === editingEvent.id ? { ...editingEvent } : evt)));
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (window.confirm(`Delete event: ${editingEvent.title}?`)) {
      setEvents(events.filter(evt => evt.id !== editingEvent.id));
      setEditingEvent(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📅 Scheduler</h2>

      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Add New Task</h3>
        <form onSubmit={handleAddEvent} className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Task Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
        </form>
      </div>

      {editingEvent && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Edit Task</h3>
          <form onSubmit={handleEditEvent} className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              value={editingEvent.start}
              onChange={(e) => setEditingEvent({ ...editingEvent, start: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditingEvent(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button type="button" onClick={handleDeleteEvent} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={events}
          eventClick={handleEventClick}
          height="75vh"
        />
      </div>
    </div>
  );
};

export default Scheduler;
