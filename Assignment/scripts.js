document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const clearAllButton = document.getElementById("clearAllButton");

    loadTasks();

    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
    clearAllButton.addEventListener("click", function() {
        taskList.innerHTML = "";
        saveTasks();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const li = document.createElement("li");
            li.setAttribute("draggable", "true");

            const span = document.createElement("span");
            span.textContent = taskText;
            span.addEventListener("dblclick", function() {
                editTask(span);
            });
            li.appendChild(span);

            const buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("task-buttons");

            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";
            completeButton.classList.add("complete");
            completeButton.addEventListener("click", function() {
                li.classList.toggle("completed");
                saveTasks();
            });
            buttonsDiv.appendChild(completeButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete");
            deleteButton.addEventListener("click", function() {
                taskList.removeChild(li);
                saveTasks();
            });
            buttonsDiv.appendChild(deleteButton);

            li.appendChild(buttonsDiv);
            taskList.appendChild(li);
            taskInput.value = "";
            saveTasks();
            addDragAndDrop(li);
        }
    }

    function editTask(span) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                span.textContent = input.value;
                span.style.display = "";
                saveTasks();
                input.remove();
            }
        });
        span.style.display = "none";
        span.parentNode.insertBefore(input, span);
        input.focus();
        input.addEventListener("blur", function() {
            span.style.display = "";
            input.remove();
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll("li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").textContent,
                completed: li.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.setAttribute("draggable", "true");

            const span = document.createElement("span");
            span.textContent = task.text;
            span.addEventListener("dblclick", function() {
                editTask(span);
            });
            li.appendChild(span);

            const buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("task-buttons");

            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";
            completeButton.classList.add("complete");
            completeButton.addEventListener("click", function() {
                li.classList.toggle("completed");
                saveTasks();
            });
            buttonsDiv.appendChild(completeButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete");
            deleteButton.addEventListener("click", function() {
                taskList.removeChild(li);
                saveTasks();
            });
            buttonsDiv.appendChild(deleteButton);

            if (task.completed) {
                li.classList.add("completed");
            }

            li.appendChild(buttonsDiv);
            taskList.appendChild(li);
            addDragAndDrop(li);
        });
    }

    function addDragAndDrop(li) {
        li.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text/plain", event.target.id);
            setTimeout(() => {
                li.classList.add("dragging");
            }, 0);
        });

        li.addEventListener("dragend", function() {
            li.classList.remove("dragging");
            saveTasks();
        });

        taskList.addEventListener("dragover", function(event) {
            event.preventDefault();
            const afterElement = getDragAfterElement(taskList, event.clientY);
            const draggingElement = document.querySelector(".dragging");
            if (afterElement == null) {
                taskList.appendChild(draggingElement);
            } else {
                taskList.insertBefore(draggingElement, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
