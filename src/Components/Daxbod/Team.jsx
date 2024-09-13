import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./Title";
import { IoMdPersonAdd } from "react-icons/io";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { TbFaceIdError } from "react-icons/tb";

const Team = () => {
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    country: "",
    role: "",
    image: "",
  });
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    country: "",
    role: "",
    image: "",
  });
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSlideOut, setIsSlideOut] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        if (showForm) {
          setNewUser({ ...newUser, image: imageUrl });
        } else if (editForm) {
          setEditUser({ ...editUser, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    },
  });

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/hr-management/leader/get"
        );
        setLeaders(response.data);
      } catch (error) {
        console.error("There was an error fetching the leaders:", error);
        setError("Failed to fetch leaders. Please try again.");
      }
    };

    fetchLeaders();
  }, []);

  const handleAddClick = () => {
    setIsSlideOut(true);
    setShowForm(true);
  };

  const handleEditClick = (leader) => {
    setEditUser({
      id: leader.id,
      name: leader.name,
      country: leader.country,
      role: leader.role,
      image: leader.image,
    });
    setEditForm(true);
  };

  const handleCloseForm = () => {
    setIsSlideOut(false);
    setTimeout(() => setShowForm(false), 300); // Delay hiding the form to complete slide-out animation
    setError(null);
  };

  const handleCloseEditForm = () => {
    setEditForm(false);
    setError(null);
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/hr-management/leader/add",
        newUser
      );
      setLeaders([...leaders, newUser]);
      setLoading(false);
      handleCloseForm();
    } catch (error) {
      console.error("There was an error adding the leader:", error);
      setError("Failed to add leader. Please try again.");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/hr-management/leader/edit/${editUser.id}`,
        editUser
      );
      setLeaders(
        leaders.map((leader) => (leader.id === editUser.id ? editUser : leader))
      );
      setLoading(false);
      handleCloseEditForm();
    } catch (error) {
      console.error("There was an error updating the leader:", error);
      setError("Failed to update leader. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/hr-management/leader/delete/${id}`
      );
      setLeaders(leaders.filter((leader) => leader.id !== id));
    } catch (error) {
      console.error(
        "There was an error deleting the leader:",
        error.response || error.message
      );
      setError("Failed to delete leader. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-3 rounded-2xl dark:bg-gray-900 dark:text-gray-300 flex-1 flex gap-5 flex-col">
      <div className="flex justify-between items-center ml-2">
        <Title>Our dynamic Leaders</Title>
        <button
          className="mr-2 text-gray-500 py-2 px-4 rounded-full flex items-center justify-center"
          onClick={handleAddClick}
        >
          <IoMdPersonAdd className="text-2xl" />
        </button>
      </div>

      {leaders.length > 0 ? (
        leaders.map((leader) => (
          <div
            key={leader.id}
            className="flex justify-between items-center my-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{leader.name}</h2>
                <span className="font-semibold text-gray-400 text-sm">
                  {leader.role}
                </span>
              </div>
            </div>
            <span className="p-3 rounded-full text-xs text-gray-700 font-semibold dark:bg-gray-500 dark:text-gray-300 flex gap-3">
              <button
                className="text-2xl text-gray-500 cursor-pointer"
                onClick={() => handleEditClick(leader)}
              >
                <AiTwotoneEdit />
              </button>
              <button
                className="text-2xl text-gray-500 cursor-pointer"
                onClick={() => handleDelete(leader.id)}
              >
                <MdOutlineDeleteSweep />
              </button>
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-2xl flex items-center justify-center h-full gap-3">
          <TbFaceIdError className="text-4xl" /> <i>No leaders found.</i>
        </p>
      )}

      {showForm && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 transition-transform duration-300 ${
            isSlideOut ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl dark:bg-gray-800 w-full max-w-md">
            <h2 className="w-full text-xl font-bold mb-4">Add New Leader</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name" className="block mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="country" className="block mb-2">
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={newUser.country}
                onChange={handleChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="role" className="block mb-2">
                Role:
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="image" className="block mb-2">
                Image:
              </label>
              <div
                {...getRootProps({
                  className:
                    "dropzone border p-4 rounded-md cursor-pointer mb-4",
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
              {newUser.image && (
                <img
                  src={newUser.image}
                  alt="Selected"
                  className="w-24 h-24 object-cover rounded-md mb-4"
                />
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Leader"}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="ml-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {editForm && (
        <div
          className={`fixed inset-0 ml-52 flex items-center justify-center bg-gray-800 bg-opacity-10 transition-transform duration-300 ${
            isSlideOut ? "translate-x-0" : "translate-x-100"
          }`}
        >
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl dark:bg-gray-800 w-full max-w-md">
            <h2 className="w-full text-xl font-bold mb-4">Edit Leader</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="name" className="block mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editUser.name}
                onChange={handleEditChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="country" className="block mb-2">
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={editUser.country}
                onChange={handleEditChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="role" className="block mb-2">
                Role:
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={editUser.role}
                onChange={handleEditChange}
                className="border w-full px-3 py-2 mb-4 rounded-md"
                required
              />
              <label htmlFor="image" className="block mb-2">
                Image:
              </label>
              <div
                {...getRootProps({
                  className:
                    "dropzone border p-4 rounded-md cursor-pointer mb-4",
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
              {editUser.image && (
                <img
                  src={editUser.image}
                  alt="Selected"
                  className="w-24 h-24 object-cover rounded-md mb-4"
                />
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Leader"}
              </button>
              <button
                type="button"
                onClick={handleCloseEditForm}
                className="ml-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
