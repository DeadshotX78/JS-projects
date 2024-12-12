document.addEventListener('DOMContentLoaded', () => {
    // Get elements from the DOM
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskDeadline = document.getElementById('taskDeadline');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const clearAllButton = document.getElementById('clearAllButton');
  
    // Add Task Function
    function addTask(taskText, taskPriority, taskDeadline, isCompleted = false) {
      const taskItem = document.createElement('li');
      taskItem.textContent = taskText;
  
      // Priority
      const prioritySpan = document.createElement('span');
      prioritySpan.textContent = taskPriority;
      prioritySpan.classList.add('priority', taskPriority.toLowerCase());
      taskItem.appendChild(prioritySpan);
  
      // Deadline
      if (taskDeadline) {
        const deadlineSpan = document.createElement('span');
        deadlineSpan.textContent = taskDeadline;
        deadlineSpan.classList.add('deadline');
        taskItem.appendChild(deadlineSpan);
      }
  
      // Complete Button
      const completeButton = document.createElement('button');
      completeButton.innerHTML = '<i class="fas fa-check"></i>';
      completeButton.classList.add('complete-btn');
      completeButton.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        saveTasksToLocalStorage();
      });
  
      // Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
          taskList.removeChild(taskItem);
          saveTasksToLocalStorage();
        }
      });
  
      taskItem.appendChild(completeButton);
      taskItem.appendChild(deleteButton);
  
      if (isCompleted) {
        taskItem.classList.add('completed');
      }
  
      // Drag-and-Drop Events
      taskItem.setAttribute('draggable', 'true');
      taskItem.addEventListener('dragstart', handleDragStart);
      taskItem.addEventListener('dragover', handleDragOver);
      taskItem.addEventListener('drop', handleDrop);
      taskItem.addEventListener('dragend', handleDragEnd);
  
      // Append Task
      taskList.appendChild(taskItem);
  
      // Save updated tasks to localStorage
      saveTasksToLocalStorage();
    }
  
    // Save Tasks to localStorage
    function saveTasksToLocalStorage() {
      const tasks = [];
      taskList.querySelectorAll('li').forEach((taskItem) => {
        tasks.push({
          text: taskItem.childNodes[0].textContent.trim(),
          priority: taskItem.querySelector('.priority').textContent.trim(),
          deadline: taskItem.querySelector('.deadline')?.textContent.trim() || '',
          completed: taskItem.classList.contains('completed'),
        });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Load Tasks from localStorage
    function loadTasksFromLocalStorage() {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      tasks.forEach((task) => {
        addTask(task.text, task.priority, task.deadline, task.completed);
      });
    }
  
    // Clear All Tasks
    clearAllButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
      }
    });
  
    // Handle Task Input Submission
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      const taskPriorityValue = taskPriority.value;
      const taskDeadlineValue = taskDeadline.value;
  
      if (taskText !== '') {
        addTask(taskText, taskPriorityValue, taskDeadlineValue);
        taskInput.value = '';  // Clear input
        taskPriority.value = 'Low';  // Reset priority
        taskDeadline.value = '';  // Clear deadline
      }
    });
  
    // Load tasks from localStorage when page is loaded
    loadTasksFromLocalStorage();
  
    // Drag-and-Drop Logic
    let draggedTask = null;
  
    function handleDragStart(e) {
      draggedTask = e.target;
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    }
  
    function handleDragOver(e) {
      e.preventDefault();
    }
  
    function handleDrop(e) {
      e.preventDefault();
      if (e.target.tagName === 'LI') {
        taskList.insertBefore(draggedTask, e.target.nextSibling || e.target);
        saveTasksToLocalStorage();
      }
    }
  
    function handleDragEnd(e) {
      e.target.style.display = 'block';
      draggedTask = null;
    }
  });
  