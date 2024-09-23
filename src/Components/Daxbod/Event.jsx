import React, { useState, useEffect } from "react";
import Title from "./Title";
import { MdEventRepeat, MdOutlineDeleteSweep } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    type: "",
    title: "",
    description: "",
    date: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false); // To handle edit mode
  const [isSlideOut, setIsSlideOut] = useState(false); // For sliding animation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/hr-management/events/get-events"
        );
        setEvents(response.data);
      } catch (error) {
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:3000/hr-management/events/add-events",
        newEvent
      );
      setNewEvent({
        type: "",
        title: "",
        description: "",
        date: "",
      });
      const response = await axios.get(
        "http://localhost:3000/hr-management/events/get-events"
      );
      setEvents(response.data);
      alert("Event added successfully!");
    } catch (error) {
      setError("Failed to add event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `http://localhost:3000/hr-management/events/delete-events/${id}`
      );
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      alert("Event deleted successfully!");
    } catch (error) {
      setError("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
    setIsSlideOut(!isSlideOut);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsSlideOut(true);
  };

  const handleCloseEditForm = () => {
    setEditForm(false);
    setShowForm(false);
    setIsSlideOut(true);
  };

  return (
    <div className="bg-white p-3 rounded-2xl dark:bg-gray-900 dark:text-gray-300 flex-1 flex flex-col gap-5">
      <div className="flex justify-between items-center ml-2">
        <Title>Events</Title>
        <button
          className="mr-2 text-gray-500 py-2 px-4 rounded-full flex items-center justify-center"
          onClick={toggleFormVisibility}
        >
          <MdEventRepeat className="text-2xl" />
        </button>
      </div>

      {/* Show loading indicator if data is being fetched */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Show error message if there's an error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Event List */}
      {events.map((event) => (
        <div key={event.id} className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <span className="bg-gray-300 text-gray-700 p-2 rounded-2xl h-16 w-16 font-bold text-center">
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <div>
              <h1 className="text-xl font-bold">{event.title}</h1>
              <p className="text-gray-400">{event.description}</p>
            </div>
          </div>
          <button
            className="text-2xl text-gray-500 cursor-pointer"
            onClick={() => handleDeleteEvent(event.id)}
          >
            <MdOutlineDeleteSweep />
          </button>
        </div>
      ))}

      {/* Modal Popup for Form */}
      {showForm && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 transition-transform duration-300 ${
            isSlideOut ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col items-center w-full max-w-md relative">
            {/* <button
              // onClick={editForm ? handleCloseEditForm : handleCloseForm}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <MdOutlineCancel />
            </button> */}
            <h2 className="text-2xl font-bold mb-4">
              {editForm ? "Edit Event" : "Add New Event"}
            </h2>
            <form
              onSubmit={editForm ? handleEditSubmit : handleAddEvent}
              className="w-full"
            >
              <div className="mb-4">
                <input
                  type="text"
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  placeholder="Event Type"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Event Title"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Event Description"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-500 p-2 rounded-md text-md flex items-center gap-1 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>Processing...</span>
                    </>
                  ) : editForm ? (
                    <>
                      <RxUpdate />
                      <span>Update</span>
                    </>
                  ) : (
                    <>
                      <IoMdAddCircleOutline />
                      <span>Add</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={editForm ? handleCloseEditForm : handleCloseForm}
                  className="bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-500 p-2 rounded-md text-md flex items-center gap-1 transition-colors duration-200"
                >
                  <MdOutlineCancel />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
