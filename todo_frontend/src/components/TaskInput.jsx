import React, { useState, useEffect } from "react";
// import axios from "axios";
import { localStorageService } from "../services/localStorageService";
import dayjs from "dayjs";

const TaskInput = ({
  onTaskAdded,
  selectedDate,
  setSelectedDate,
  tasks,
  reminderTasks = [],
}) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = () => {
    if (!title.trim() || loading) return;
    setLoading(true);
    try {
      localStorageService.addTask({
        title: title.trim(),
        due_date: selectedDate,
      });
      setTitle("");
      if (typeof onTaskAdded === "function") {
        onTaskAdded();
      }
    } catch (error) {
      console.log("Lỗi khi thêm task: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {reminderTasks.length > 0 && (
        <div className="p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
          {reminderTasks.map((task) => (
            <p key={task.id} className="text-yellow-700 text-sm font-medium">
              ⚠️ Bạn còn nhiệm vụ: "{task.title}" ngày{" "}
              {dayjs(task.due_date || task.created_at).format("D/M/YYYY")} chưa
              hoàn thành
            </p>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập công việc ......"
          className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleAddTask}
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "➕"}
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
