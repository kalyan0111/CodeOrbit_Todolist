document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let currentFilter = "all";

  // Save tasks to localStorage
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // Render tasks based on filter
  function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      li.innerHTML = `
        <div class="todo-content">
          <input type="checkbox" ${todo.completed ? "checked" : ""} />
          <span class="todo-text">${escapeHTML(todo.text)}</span>
        </div>
        <button class="delete-btn" aria-label="Delete Task">&times;</button>
      `;

      // Toggle completed status
      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      // Delete task
      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      todoList.appendChild(li);
    });
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
  }

  // Add a new task
  function addTodo(text) {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
  }

  // Toggle completed state
  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
  }

  // Delete a task
  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }

  // Form submit handler
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text !== "") {
      addTodo(text);
      todoInput.value = "";
    }
  });

  // Filter button handlers
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });

  // Initial Render
  renderTodos();
});