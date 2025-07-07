import React, { useState, useEffect } from "react";
// import axios from "axios";
import { localStorageService } from "../services/localStorageService";
import dayjs from "dayjs";

const TaskInput = ({ onTaskAdded, selectedDate, setSelectedDate, tasks }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUncompletedPreviousTasks, setHasUncompletedPreviousTasks] =
    useState(false);

  // Kiểm tra xem có nhiệm vụ chưa hoàn thành từ ngày hôm trước không
  const checkUncompletedPreviousTasks = () => {
    const allTasks = tasks || localStorageService.getAllTasks();
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const uncompletedTasks = allTasks.filter(
      (task) => !task.completed && dayjs(task.due_date).isBefore(dayjs(), "day")
    );

    setHasUncompletedPreviousTasks(uncompletedTasks.length > 0);
  };

  useEffect(() => {
    checkUncompletedPreviousTasks();
  }, [tasks]); // Kiểm tra lại khi tasks thay đổi

  const handleAddTask = () => {
    if (!title.trim() || loading || hasUncompletedPreviousTasks) return;

    setLoading(true);
    try {
      // await axios.post("http://localhost:8000/api/tasks", { title });
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
      {hasUncompletedPreviousTasks && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            ⚠️ Bạn có nhiệm vụ chưa hoàn thành từ ngày hôm trước. Vui lòng hoàn
            thành chúng trước khi thêm nhiệm vụ mới.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập công việc ......"
          className={`flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
            hasUncompletedPreviousTasks ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          disabled={hasUncompletedPreviousTasks}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
            hasUncompletedPreviousTasks ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          disabled={hasUncompletedPreviousTasks}
        />
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white ${
            loading || hasUncompletedPreviousTasks
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleAddTask}
          disabled={loading || hasUncompletedPreviousTasks}
        >
          {loading ? "Đang thêm..." : hasUncompletedPreviousTasks ? "" : "➕"}
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
