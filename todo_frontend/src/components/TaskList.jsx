import React from "react";
import dayjs from "dayjs";

const TaskList = ({
  tasks = [],
  loading,
  onDelete,
  onComplete,
  onEditClick,
  editingTask,
  editTitle,
  setEditTitle,
  onEditSave,
  onEditCancel,
  selectedDate,
  reminderTasks = [],
}) => {
  if (loading) return <p className="text-blue-500 text-center">Đang tải...</p>;

  if (tasks.length === 0)
    return <p className="text-gray-500 text-center">Không có công việc nào.</p>;

  return (
    <ul className="mt-4 space-y-3">
      {tasks.map((task) => {
        const isReminder = reminderTasks.some((t) => t.id === task.id);
        return (
          <li
            key={task.id}
            className={`bg-white p-3 rounded-lg shadow flex flex-col md:flex-row justify-between sm:items-center hover:bg-blue-50 transition ${
              task.completed ? "opacity-60 line-through" : ""
            }`}
          >
            {editingTask === task.id ? (
              <div className="flex flex-col sm:flex-row w-full gap-2 items-center">
                <input
                  className="flex-grow p-2 border rounded-lg"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-center w-full sm:w-auto">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => onEditSave(task.id)}
                  >
                    Lưu
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={onEditCancel}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-lg">
                  {task.title}
                  {isReminder && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                      Từ ngày cũ
                    </span>
                  )}
                </span>
                <div className="flex gap-3 mt-2 sm:mt-0 sm:items-center justify-center w-full sm:w-auto">
                  {!task.completed && (
                    <>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                        title="Xóa"
                      >
                        <span
                          role="img"
                          aria-label="delete"
                          className="text-red-500"
                        >
                          🗑️
                        </span>
                      </button>
                      <button
                        onClick={() => onComplete(task.id)}
                        className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                        title="Hoàn thành"
                      >
                        <span
                          role="img"
                          aria-label="complete"
                          className="text-green-600"
                        >
                          ✅
                        </span>
                      </button>
                      <button
                        onClick={() => onEditClick(task)}
                        className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition"
                        title="Sửa"
                      >
                        <span
                          role="img"
                          aria-label="edit"
                          className="text-yellow-600"
                        >
                          ✏️
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TaskList;
