import React, { useEffect, useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { localStorageService } from "../services/localStorageService";
import dayjs from "dayjs";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    setLoading(true);
    try {
      const tasks = localStorageService.getAllTasks();
      setTasks(tasks);
    } catch (error) {
      console.log("Lỗi khi tải công việc: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks(); //cap nhat lai danh sach
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa công việc này chứ ?"
    );
    if (!confirmDelete) return;

    try {
      // await axios.delete(`http://localhost:8000/api/tasks/${id}`);
      localStorageService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log("Lỗi khi xóa công việc: ", error);
    }
  };

  const handleCompleteTask = (id) => {
    try {
      // await axios.put(`http://localhost:8000/api/tasks/${id}`, {
      //   completed: true,
      // });
      localStorageService.updateTask(id, { completed: true });
      fetchTasks();
    } catch (error) {
      console.log("Lỗi khi hoàn thành công việc: ", error);
    }
  };

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditClick = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleEditSave = async (id) => {
    try {
      // await axios.put(`http://localhost:8000/api/tasks/${id}`, {
      //   title: editTitle,
      // });
      localStorageService.updateTask(id, { title: editTitle });
      setEditingTask(null);
      setEditTitle("");
      fetchTasks();
    } catch (error) {
      console.log("Lỗi khi sửa công việc: ", error);
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
    setEditTitle("");
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    return dayjs().format("YYYY-MM-DD");
  });

  const now = dayjs();
  const weekAgo = now.subtract(7, "day");

  const tasksInWeek = tasks.filter((task) =>
    dayjs(task.created_at).isAfter(weekAgo)
  );
  const completedInWeek = tasksInWeek.filter((t) => t.completed).length;
  const uncompletedInWeek = tasksInWeek.filter((t) => !t.completed).length;

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-gray-100 rounded-xl shadow">
      <div className="mb-4 p-3 rounded-lg shadow text-center bg-white">
        <h3 className="font-bold mb-2">🤝 Thống kê 7 ngày gần nhất: </h3>
        <p>
          Tổng số nhiệm vụ: <b>{tasksInWeek.length}</b>{" "}
        </p>
        <p>
          👍 Hoàn thành: <b className="text-green-600">{completedInWeek}</b>{" "}
        </p>
        <p>
          👎 Chưa hoàn thành:{" "}
          <b className="text-red-600">{uncompletedInWeek}</b>{" "}
        </p>
      </div>
      <TaskInput
        onTaskAdded={handleTaskAdded}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TaskList
        tasks={tasks}
        loading={loading}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
        onEditClick={handleEditClick}
        editingTask={editingTask}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        onEditSave={handleEditSave}
        onEditCancel={handleEditCancel}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TodoApp;
