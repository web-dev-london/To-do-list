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
    return JSON.parse(localStorage.getItem("todo-list")) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showTodo(filter) {
  const todos = getTodos();
  let taskHtml = "";
  todos.forEach(({ id, name, status }) => {
    let isCompleted = status === "completed" ? "checked" : "";
    if (filter === 'all' || filter === status) {
      taskHtml += `
    <li class="task">
      <label for="task-${id}">
        <input onclick="updateStatus(this)" type="checkbox" id="task-${id}" ${isCompleted} />
        <p class="${isCompleted ? "completed" : ""}">${name}</p>
      </label>
      <div class="settings">
        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
        <ul class="task-menu">
          <li onclick="editTask(${id}, '${name.replace(/'/g, "\\'")}')">
            <i class="uil uil-pen"></i> Edit
          </li>
          <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i> Delete</li>
        </ul>
      </div>
    </li>
  `;
    }
  });
  taskBox.innerHTML = taskHtml || `<span>You don't have any task here</span>`;
}

taskInput.addEventListener("keyup", (e) => {
  const userTask = taskInput.value.trim();
  if (e.key === "Enter" && userTask) {
    const todos = getTodos();

    if (editId !== null) {
      const taskIndex = todos.findIndex((todo) => todo.id === editId);
      if (taskIndex !== -1) {
        todos[taskIndex].name = userTask;
      }
      editId = null;
    } else {
      todos.push({ id: Date.now(), name: userTask, status: "pending" });
    }
    saveTodos(todos);
    showTodo("all");
    taskInput.value = ""; // Clear input field
  }
});


function updateStatus(task) {
  const taskId = Number(task.id.replace("task-", "")); // Extract numeric ID
  const todos = getTodos();
  const todo = todos.find((todo) => todo.id === taskId);

  if (!todo) return; // Prevent errors if todo is not found

  todo.status = task.checked ? "completed" : "pending";
  saveTodos(todos);
  showTodo(document.querySelector("span.active").id);
}

function showMenu(selectedTask) {
  const taskMenu = selectedTask.parentElement.querySelector(".task-menu");
  taskMenu.classList.add("show");

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
  taskInput.value = taskName;
  editId = taskId;
  taskInput.focus();
}

// Load tasks on page load
showTodo("all");































// document.addEventListener('DOMContentLoaded', () => {
//   loadTasks();
//   document.getElementById('addTaskButton').addEventListener('click', addTask);
// });

// function addTask() {
//   const taskInput = document.getElementById('taskInput');
//   const taskText = taskInput.value.trim();

//   if (taskText === '') return;

//   const taskList = document.getElementById('taskList');
//   const li = document.createElement('li');

//   li.innerHTML = `<span onclick="toggleTask(this)">${taskText}</span>
//                     <button onclick="editTask(this)">✍️</button>
//                   <button onclick="deleteTask(this)">🗑️</button>`;

//   taskList.appendChild(li);
//   taskInput.value = '';
//   saveTasks();
// };

// function toggleTask(element) {
//   element.classList.toggle('completed');
//   saveTasks();
// };

// function editTask(button) {
//   const span = button.parentElement.querySelector('span');
//   const newText = prompt('Edit the task:', span.textContent);

//   if (newText !== null && newText.trim() !== '') {
//     span.textContent = newText.trim();
//     saveTasks();
//   }
// };

// function deleteTask(button) {
//   button.parentElement.remove();
//   saveTasks();
// };

// function saveTasks() {
//   let tasks = [];
//   document.querySelectorAll("#taskList li").forEach(li => {
//     tasks.push({ text: li.querySelector("span").textContent.trim(), completed: li.querySelector("span").classList.contains("completed") });
//   });
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function loadTasks() {
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   const taskList = document.getElementById('taskList');

//   taskList.innerHTML = '';

//   tasks.forEach((task) => {
//     const li = document.createElement('li');

//     li.innerHTML = `<span onclick="toggleTask(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span> 
//                                 <button onclick="editTask(this)">✍️</button>
//                                 <button onclick="deleteTask(this)">🗑️</button>`;

//     taskList.appendChild(li);
//   });
// };

