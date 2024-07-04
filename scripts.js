document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
document.getElementById('all-tasks').addEventListener('click', () => filterTasks('all'));
document.getElementById('active-tasks').addEventListener('click', () => filterTasks('active'));
document.getElementById('completed-tasks').addEventListener('click', () => filterTasks('completed'));

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskText = document.getElementById('task-input').value;
    if (taskText) {
        const newTask = {
            text: taskText,
            time: 0,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        document.getElementById('task-input').value = '';
    }
}

function loadTasks() {
    renderTasks();
}

function renderTasks(filter = 'all') {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed)) {
            const newTask = document.createElement('li');
            newTask.classList.add('task-item');
            if (task.completed) {
                newTask.classList.add('completed');
            }
            newTask.innerHTML = `
                ${task.text}
                <div>
                    <button class="start-btn">Start</button>
                    <button class="stop-btn" disabled>Stop</button>
                    <button class="reset-btn">Reset</button>
                    <button class="delete-btn">Șterge</button>
                    <span class="time">${formatTime(task.time)}</span>
                </div>
            `;
            taskList.appendChild(newTask);

            const startBtn = newTask.querySelector('.start-btn');
            const stopBtn = newTask.querySelector('.stop-btn');
            const resetBtn = newTask.querySelector('.reset-btn');
            const deleteBtn = newTask.querySelector('.delete-btn');
            const timeDisplay = newTask.querySelector('.time');
            let timer;

            startBtn.addEventListener('click', function() {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                timer = setInterval(function() {
                    task.time++;
                    timeDisplay.textContent = formatTime(task.time);
                    saveTasks();
                }, 1000);
            });

            stopBtn.addEventListener('click', function() {
                clearInterval(timer);
                startBtn.disabled = false;
                stopBtn.disabled = true;
            });

            resetBtn.addEventListener('click', function() {
                clearInterval(timer);
                task.time = 0;
                timeDisplay.textContent = formatTime(task.time);
                saveTasks();
            });

            deleteBtn.addEventListener('click', function() {
                clearInterval(timer);
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(filter);
            });

            newTask.addEventListener('dblclick', function() {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });
        }
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function filterTasks(filter) {
    renderTasks(filter);
}
