/** @format */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { user, logout } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
      toast.success("Tasks loaded successfully!");
    } catch (error) {
      toast.error("Failed to fetch tasks!");
    }
  };

  const handleAdd = async () => {
    if (!newTask.title.trim()) return toast.error("Task title required!");
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", newTask);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: "", description: "" });
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task!");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
    toast("Editing mode enabled ✏️", { icon: "📝" });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        newTask
      );
      setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)));
      setEditingTask(null);
      setNewTask({ title: "", description: "" });
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task!");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-700">📋 Task Dashboard</h1>
            {user && (
              <p className="text-gray-500 text-sm mt-1">
                Welcome, <span className="font-semibold">{user.name}</span> (
                {user.email})
              </p>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              toast("Logged out successfully 👋");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 rounded-md"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border p-2 rounded-md"
          />
          {editingTask ? (
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Update Task
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Add Task
            </button>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-start border p-3 rounded-md hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
