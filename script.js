const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");


let editId = null;

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function getTodos() {
  try {
    const todos = JSON.parse(localStorage.getItem("todo-list"));
    return Array.isArray(todos) ? todos : [];
  } catch {
    return [];
  }
}


function saveTodos(todos) {
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && taskInput.value.trim().length > 0) {
    addOrEditTask();
  }
});

function addOrEditTask() {
  const userTask = taskInput.value.trim();
  if (!userTask) return;

  const todos = getTodos();

  if (editId !== null) {
    const taskIndex = todos.findIndex((todo) => todo.id === editId);
    if (taskIndex !== -1)
      todos[taskIndex].name = userTask;
    editId = null;
  } else {
    todos.push({ id: Date.now(), name: userTask, status: "pending" });
  }
  saveTodos(todos);
  showTodo(document.querySelector("span.active").id);
  taskInput.value = "";
}

function showTodo(filter) {
  const todos = getTodos();
  let taskHtml = "";
  todos.forEach(({ id, name, status }) => {
    let isCompleted = status === "completed";
    let completedClass = isCompleted ? "completed-task" : "";
    if (filter === 'all' || filter === status) {
      taskHtml += `
    <li class="task ${completedClass}">
      <label for="task-${id}">
        <input onclick="updateStatus(this)" type="checkbox" id="task-${id}" ${isCompleted ? "checked" : ""} />
        <p class="${isCompleted ? "completed" : ""}">${name}</p>
      </label>
      <div class="settings">
        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
        <ul class="task-menu">
             ${isCompleted ? "" : `<li onclick="editTask(${id}, '${name.replace(/'/g, "\\'")}')">
              <i class="uil uil-pen"></i> Edit
            </li>`}
          <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i> Delete</li>
        </ul>
      </div>
    </li>
  `;
    }
  });
  taskBox.innerHTML = taskHtml || `<span>You don't have any task here</span>`;

  document.querySelectorAll(".completed-task .task-menu").forEach((menu) => {
    menu.style.bottom = '-27px';
  });
}

function showMenu(selectedTask) {
  const taskMenu = selectedTask.parentElement.querySelector(".task-menu");
  taskMenu.classList.toggle("show");

  setTimeout(() => {
    function removeMenu(e) {
      if (!taskMenu.contains(e.target) && e.target !== selectedTask) {
        taskMenu.classList.remove("show");
        document.removeEventListener("click", removeMenu);
      }
    }
    document.addEventListener("click", removeMenu, { once: true });
  }, 0);
}


function updateStatus(task) {
  const taskId = Number(task.id.replace("task-", "")); // Extract numeric ID
  const todos = getTodos();
  const todo = todos.find((todo) => todo.id === taskId);

  if (!todo) return;

  todo.status = task.checked ? "completed" : "pending";
  saveTodos(todos);
  showTodo(document.querySelector("span.active").id);
}

function deleteTask(taskId) {
  const todos = getTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== taskId);
  saveTodos(updatedTodos);
  showTodo(document.querySelector("span.active").id);
}

clearAll.addEventListener("click", () => {
  const todos = getTodos();
  const updatedTodos = todos.filter((todo) => todo.status !== "completed");
  saveTodos(updatedTodos);
  showTodo(document.querySelector("span.active").id);
});

function editTask(taskId, taskName) {
  const todos = getTodos();
  const todo = todos.find((todo) => todo.id === taskId);

  if (todo && todo.status !== "completed") {
    taskInput.value = taskName;
    editId = taskId;
    taskInput.focus();
  }
}

// Load tasks on page load
showTodo("all");

