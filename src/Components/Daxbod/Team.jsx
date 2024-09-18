import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./Title";
import { IoMdPersonAdd } from "react-icons/io";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
// import { useDropzone } from "react-dropzone"; // Commented out for now

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

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   accept: "image/*",
  //   onDrop: (acceptedFiles) => {
  //     const file = acceptedFiles[0];
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const imageUrl = reader.result;
  //       if (showForm) {
  //         setNewUser({ ...newUser, image: imageUrl });
  //       } else if (editForm) {
  //         setEditUser({ ...editUser, image: imageUrl });
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   },
  // });

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/hr-management/leader/get"
        );
        setLeaders(response.data);
      } catch (error) {
        console.error("Error fetching leaders:", error);
        setError("Failed to fetch leaders. Please try again.");
      }
    };

    fetchLeaders();
  }, []);

  const handleAddClick = () => {
    setIsSlideOut(true);
    setShowForm(true);
    setEditForm(false);
  };

  const handleEditClick = (leader) => {
    setEditUser({
      id: leader.id,
      name: leader.name,
      country: leader.country,
      role: leader.role,
      image: leader.image,
    });
    setIsSlideOut(true);
    setShowForm(true);
    setEditForm(true);
  };

  const handleCloseForm = () => {
    setIsSlideOut(false);
    setTimeout(() => {
      setShowForm(false);
      setNewUser({ name: "", country: "", role: "", image: "" }); // Reset new user state
      setError(null);
    }, 300);
  };

  const handleCloseEditForm = () => {
    setIsSlideOut(false);
    setTimeout(() => {
      setEditForm(false);
      setEditUser({ id: "", name: "", country: "", role: "", image: "" }); // Reset edit user state
      setError(null);
    }, 300);
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
      await axios.post(
        "http://localhost:3000/hr-management/leader/add",
        newUser
      );
      setLeaders([...leaders, newUser]);
      handleCloseForm();
    } catch (error) {
      console.error("Error adding leader:", error);
      setError("Failed to add leader. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/hr-management/leader/edit/${editUser.id}`,
        editUser
      );
      setLeaders(
        leaders.map((leader) => (leader.id === editUser.id ? editUser : leader))
      );
      handleCloseEditForm();
    } catch (error) {
      console.error("Error updating leader:", error);
      setError("Failed to update leader. Please try again.");
    } finally {
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
      console.error("Error deleting leader:", error);
      setError("Failed to delete leader. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-3 rounded-2xl dark:bg-gray-900 dark:text-gray-300 flex-1 flex gap-5 flex-col">
      <div className="flex justify-between items-center ml-2">
        <Title>Our Dynamic Leaders</Title>
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
              {/* <button
                className="text-2xl text-gray-500 cursor-pointer"
                onClick={() => handleEditClick(leader)}
              >
                <AiTwotoneEdit />
              </button> */}
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
          <i>No leaders found.</i>
        </p>
      )}

      {showForm && (editForm || !editForm) && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10 transition-transform duration-300 ${
            isSlideOut ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col items-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editForm ? "Edit Leader" : "Add Leader"}
            </h2>
            <form
              onSubmit={editForm ? handleEditSubmit : handleSubmit}
              className="w-full"
            >
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={editForm ? editUser.name : newUser.name}
                  onChange={editForm ? handleEditChange : handleChange}
                  placeholder="Name"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="country"
                  value={editForm ? editUser.country : newUser.country}
                  onChange={editForm ? handleEditChange : handleChange}
                  placeholder="Country"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="role"
                  value={editForm ? editUser.role : newUser.role}
                  onChange={editForm ? handleEditChange : handleChange}
                  placeholder="Role"
                  className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              {/* <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (editForm) {
                          setEditUser({ ...editUser, image: reader.result });
                        } else {
                          setNewUser({ ...newUser, image: reader.result });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
                  />
                  <img
                    src={editForm ? editUser.image : newUser.image}
                    alt="Preview"
                    className="w-24 h-24 mt-2 rounded-full"
                  />
                </div> */}
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
                  className="bg-gray-200 text-gray-800 dark:text-gray-200  dark:bg-gray-500 p-2 rounded-md text-md flex items-center gap-1 transition-colors duration-200"
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

export default Team;
