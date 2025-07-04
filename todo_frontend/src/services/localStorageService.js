// Service để quản lý tasks trong LocalStorage
const STORAGE_KEY = "todo_tasks";

export const localStorageService = {
  // Lấy tất cả tasks từ LocalStorage
  getAllTasks: () => {
    try {
      const tasks = localStorage.getItem(STORAGE_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error("Lỗi khi đọc từ LocalStorage:", error);
      return [];
    }
  },

  // Lưu tất cả tasks vào LocalStorage
  saveAllTasks: (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error("Lỗi khi lưu vào LocalStorage:", error);
      return false;
    }
  },

  // Thêm task mới
  addTask: (task) => {
    const tasks = localStorageService.getAllTasks();
    const newTask = {
      id: Date.now().toString(), // Tạo ID duy nhất bằng timestamp
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tasks.unshift(newTask); // Thêm vào đầu danh sách
    localStorageService.saveAllTasks(tasks);
    return newTask;
  },

  // Cập nhật task
  updateTask: (id, updates) => {
    const tasks = localStorageService.getAllTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorageService.saveAllTasks(tasks);
      return tasks[taskIndex];
    }
    return null;
  },

  // Xóa task
  deleteTask: (id) => {
    const tasks = localStorageService.getAllTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    localStorageService.saveAllTasks(filteredTasks);
    return true;
  },
};
