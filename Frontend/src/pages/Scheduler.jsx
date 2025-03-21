import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Scheduler = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Team Meeting", start: "2025-03-22T10:00:00", end: "2025-03-22T11:00:00" },
    { id: "2", title: "Project Deadline", start: "2025-03-25", allDay: true },
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [editingEvent, setEditingEvent] = useState(null); // Stores the event being edited

  // Handle adding a new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return alert("Please fill in all fields");
    setEvents([...events, { id: String(events.length + 1), title: newEvent.title, start: newEvent.date }]);
    setNewEvent({ title: "", date: "" });
  };

  // Handle event click (edit mode)
  const handleEventClick = ({ event }) => {
    setEditingEvent({ id: event.id, title: event.title, start: event.startStr });
  };

  // Handle event update
  const handleEditEvent = (e) => {
    e.preventDefault();
    setEvents(events.map(evt => (evt.id === editingEvent.id ? { ...editingEvent } : evt)));
    setEditingEvent(null);
  };

  // Handle event deletion
  const handleDeleteEvent = () => {
    if (window.confirm(`Delete event: ${editingEvent.title}?`)) {
      setEvents(events.filter(evt => evt.id !== editingEvent.id));
      setEditingEvent(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📅 Scheduler</h2>

      {/* Add New Task Form */}
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

      {/* Edit Event Form (if an event is being edited) */}
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

      {/* FullCalendar Scheduler */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={events}
          eventClick={handleEventClick} // Enables editing
          height="75vh"
        />
      </div>
    </div>
  );
};

export default Scheduler;
