import React, { useEffect, useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { localStorageService } from "../services/localStorageService";
import dayjs from "dayjs";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderTasks, setReminderTasks] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() => {
    return dayjs().format("YYYY-MM-DD");
  });

  const mergeTasksForToday = (allTasks, todayStr) => {
    const todayTasks = [];
    const reminders = [];
    allTasks.forEach((task) => {
      const taskDate = dayjs(task.due_date || task.created_at).format(
        "YYYY-MM-DD"
      );
      if (!task.completed && taskDate < todayStr) {
        todayTasks.push(task);
        reminders.push(task);
      } else if (taskDate === todayStr) {
        todayTasks.push(task);
      }
    });
    return { todayTasks, reminders };
  };

  const fetchTasks = () => {
    setLoading(true);
    try {
      const allTasks = localStorageService.getAllTasks();
      const todayStr = selectedDate;
      const { todayTasks, reminders } = mergeTasksForToday(allTasks, todayStr);
      setTasks(todayTasks);
      setReminderTasks(reminders);
    } catch (error) {
      console.log("Lỗi khi tải công việc: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa công việc này chứ ?"
    );
    if (!confirmDelete) return;

    try {
      localStorageService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log("Lỗi khi xóa công việc: ", error);
    }
  };

  const handleCompleteTask = (id) => {
    try {
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

  const now = dayjs();
  const startOfMonth = now.startOf("month");
  const endOfMonth = now.endOf("month");

  const tasksInMonth = tasks.filter((task) => {
    const created = dayjs(task.created_at);
    return (
      created.isAfter(startOfMonth.subtract(1, "day")) &&
      created.isBefore(endOfMonth.add(1, "day"))
    );
  });
  const completedInMonth = tasksInMonth.filter((t) => t.completed).length;
  const uncompletedInMonth = tasksInMonth.filter((t) => !t.completed).length;

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-gray-100 rounded-xl shadow">
      <div className="mb-4 p-3 rounded-lg shadow text-center bg-white">
        <h3 className="font-bold mb-2">
          🤝 Thống kê tháng {now.format("MM/YYYY")}:
        </h3>
        <p>
          Tổng số nhiệm vụ: <b>{tasksInMonth.length}</b>
        </p>
        <p>
          👍 Hoàn thành: <b className="text-green-600">{completedInMonth}</b>
        </p>
        <p>
          👎 Chưa hoàn thành:{" "}
          <b className="text-red-600">{uncompletedInMonth}</b>
        </p>
      </div>
      <TaskInput
        onTaskAdded={handleTaskAdded}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tasks={tasks}
        reminderTasks={reminderTasks}
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
        reminderTasks={reminderTasks}
      />
    </div>
  );
};

export default TodoApp;
