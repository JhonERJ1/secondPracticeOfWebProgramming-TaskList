const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskError = document.getElementById("taskError");
const taskList = document.querySelector(".TaskList");

const normalizeText = (text) =>
  text.trim().replace(/\s+/g, " ").toLowerCase();

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const isValidName = (name) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(name.trim());

const renderTasks = (filter = "all") => {
  taskList.innerHTML = "";

  tasks
    .filter(t =>
      filter === "all" ||
      (filter === "completed" && t.completed) ||
      (filter === "pending" && !t.completed)
    )
    .forEach((task, index) => {

      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      //VISTA
      const view = document.createElement("div");
      view.innerHTML = `
        <strong>${task.name}</strong>
        <p>${task.description}</p>
        <div class="actions">
          <button class="btn-complete">✓</button>
          <button class="btn-edit ${task.completed ? "disabled" : ""}">Editar</button>
          <button class="btn-delete">Eliminar</button>
        </div>
      `;

      //COMPLETAR
      view.querySelector(".btn-complete").onclick = () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(filter);
      };

      //ELIMINAR
      view.querySelector(".btn-delete").onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filter);
      };

      //EDITAR INLINE
      view.querySelector(".btn-edit").onclick = () => {
        if (task.completed) return;

        li.classList.add("editing");
        li.innerHTML = `
          <input 
            type="text" 
            name="editTaskName"
            id="editTaskName-${index}"
            value="${task.name}"
          >

          <input 
            type="text" 
            name="editTaskDescription"
            id="editTaskDescription-${index}"
            value="${task.description}"
          >

          <div class="edit-actions">
            <button class="btn-save">Guardar</button>
            <button class="btn-cancel">Cancelar</button>
          </div>
        `;

        const [nameInput, descInput] = li.querySelectorAll("input");

        li.querySelector(".btn-save").onclick = () => {
          const newNameNormalized = normalizeText(nameInput.value);

          if (!isValidName(nameInput.value)) return;

          //Evitar duplicados (excepto la misma tarea)
          const exists = tasks.some(
            (t, i) =>
              i !== index &&
              normalizeText(t.name) === newNameNormalized
          );

          if (exists) {
            alert("Ya existe una tarea con ese nombre");
            return;
          }

          task.name = nameInput.value.trim();
          task.description = descInput.value.trim();
          saveTasks();
          renderTasks(filter);
        };

        li.querySelector(".btn-cancel").onclick = () => {
          renderTasks(filter);
        };
      };

      li.appendChild(view);
      taskList.appendChild(li);
    });
};

//AGREGAR
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  taskError.textContent = "";

  if (!taskName.value.trim()) {
    taskError.textContent = "El nombre es obligatorio";
    return;
  }

  if (!isValidName(taskName.value)) {
    taskError.textContent = "Solo letras y espacios";
    return;
  }

    const newTaskName = normalizeText(taskName.value);

    //Verificar si ya existe
    const exists = tasks.some(
      task => normalizeText(task.name) === newTaskName
    );

    if (exists) {
      taskError.textContent = "Ya existe una tarea con ese nombre";
      return;
    }

  tasks.push({
    name: taskName.value.trim(),
    description: taskDescription.value.trim(),
    completed: false
  });

  saveTasks();
  taskForm.reset();
  renderTasks();
});

//FILTROS
document.getElementById("filterAll").onclick = () => renderTasks("all");
document.getElementById("filterPending").onclick = () => renderTasks("pending");
document.getElementById("filterCompleted").onclick = () => renderTasks("completed");

//LIMPIAR
document.getElementById("clearAll").onclick = () => {
  tasks = [];
  saveTasks();
  renderTasks();
};

renderTasks();