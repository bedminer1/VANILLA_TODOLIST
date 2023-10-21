import _ from 'lodash'
import './styles/style.css'


//
const sidebar = document.createElement('div')
sidebar.classList.add('sidebar')
document.body.appendChild(sidebar)

const taskTable = document.createElement('div')
taskTable.classList.add('task-table')
taskTable.innerHTML = `
<table>
<tr>
  <th>Task</th>
  <th>Project</th>
  <th>Deadline</th>
  <th>Urgency</th>
  <th>Status</th>
</tr>
<tbody id="task-table-body"></tbody>
</table>`
document.body.appendChild(taskTable)

let taskLibrary;
const DEFAULT_DATA = [
    {
        task: "Finish lesson on conditionals",
        project: "korean",
        deadline: "3",
        urgency: "red",
        status: "in progress",
      },
    {
        task: "Finish lesson on conditionals",
        project: "coding",
        deadline: "4",
        urgency: "yellow",
        status: "not done",
    }
]



const newTaskButton = document.createElement('div')
newTaskButton.classList.add('new-task-button')
newTaskButton.innerHTML = 
`
<button data-open-modal>Add</button>`

const newTaskPage = document.createElement('dialog')
newTaskPage.classList.add('new-task-list')
newTaskPage.innerHTML =
`
    <form action="">
    <div>
        Press esc to exit
    </div>
    <div>
      <label for="task">Task</label>
      <input type="text" class="u-full-width" id="task" />
    </div>
    <div>
      <label for="project">Project</label>
      <input type="text" class="u-full-width" id="project" />
    </div>
    <div>
      <label for="deadline">Deadline</label>
      <select name="deadline" id="deadline">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div>
      <label for="urgency">Urgency</label>
      <select name="urgency" id="urgency">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
    <div>
      <label for="status">Status</label>
      <select name="status" id="status" class="u-full-width">
        <option value="not done">not done</option>
        <option value="in progress">in progress</option>
        <option value="done">done</option>
      </select>
    </div>
    <button type='submit'>Add</button>
  </form>
`
sidebar.appendChild(newTaskButton)
document.body.appendChild(newTaskPage)

const openButton = document.querySelector('[data-open-modal]')
// const closeButton = document.querySelector('[data-close-modal]')
const modal = document.querySelector('dialog')

openButton.addEventListener('click', () => {
    modal.showModal()
})

// closeButton.addEventListener('click', () => {
//     modal.close()
// })



// default projects
const general = 'General'
const korean = 'Korean'
const coding = 'Coding'
addNewProject(general)
addNewProject(korean)
addNewProject(coding)


function createProject(projectName) {
    const project = document.createElement('div')
    project.classList.add('project')
    project.innerHTML = projectName
    return project
}

function addNewProject(projectName) {
    sidebar.appendChild((createProject(projectName)))
}


const $task = document.querySelector("#task");
const $project = document.querySelector("#project");
const $deadline = document.querySelector("#deadline");
const $urgency = document.querySelector("#urgency");
const $status = document.querySelector("#status");
const $tableBody = document.querySelector('#task-table-body')
const $form = document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    addTaskToTable();
    renderNewTask();
    clearForm();
  });
const $table = document.querySelector("table").addEventListener("click", (e) => {
    const currentTarget = e.target.parentNode.parentNode.childNodes[1];
    if (e.target.innerHTML == "delete") {
      if (confirm(`are you sure you want to delete ${currentTarget.innerText}`))
        deleteTask(findTask(taskLibrary, currentTarget.innerText));
    }
    if (e.target.classList.contains("status-button")) {
      changeStatus(findTask(taskLibrary, currentTarget.innerText));
    }
    updateLocalStorage();
    renderNewTask();
  });

class Task {
    constructor(task,project,deadline,urgency,status){
        this.task = task
        this.project = project
        this.deadline = deadline
        this.urgency = urgency
        this.status = status
    }
}

function addTaskToTable() {
    if ($task.value.length === 0 || $project.value.length === 0) {
        alert("Please, fill all the fields");
        return;
      }
      const newTask = new Task(
        $task.value,
        $project.value,
        $deadline.value,
        $urgency.value,
        $status.value,
      );
    
      taskLibrary.push(newTask);
      updateLocalStorage();
}

function changeStatus(currentTaskIndex) {
    if (taskLibrary[currentTaskIndex].status === 'not done') {
        taskLibrary[currentTaskIndex].status = 'in progress'
    } else if (taskLibrary[currentTaskIndex].status === 'in progress') {
        taskLibrary[currentTaskIndex].status = 'done'
    } else {
        taskLibrary[currentTaskIndex].status = 'not done'
    }
}

function deleteTask(currentTaskIndex) {
    taskLibrary.splice(currentTaskIndex, currentTaskIndex + 1)
}



function findTask(taskLibrary, currentTask) {
    if (taskLibrary.length === 0 || taskLibrary === null) {
        return;
      }

      for (task in taskLibrary)
        if (task.currentTask === currentTask) {
          return libraryArray.indexOf(task);
        }
}

function clearForm() {
        $task.value = ''
    $project.value = ''
    $deadline.value = ''
}

function updateLocalStorage() {
    localStorage.setItem("taskLibrary", JSON.stringify(taskLibrary));
}

function checkLocalStorage() {
    if (localStorage.getItem("taskLibrary")) {
        taskLibrary = JSON.parse(localStorage.getItem("taskLibrary"));
      } else {
        taskLibrary = DEFAULT_DATA;
      }
}

taskLibrary = DEFAULT_DATA

function renderNewTask() {
    checkLocalStorage();
  $tableBody.innerHTML = "";
  taskLibrary.forEach((task) => {
    const htmlTask = `
      <tr>
        <td>${task.task}</td>
        <td>${task.project}</td>
        <td>${task.deadline}</td>
        <td>${task.urgency}</td>
        <td><button class="status-button">${task.status}</button></td>
        <td><button class="delete">delete</button></td>
      </tr>
      `;
    $tableBody.insertAdjacentHTML("afterbegin", htmlTask);
  });
}

renderNewTask()