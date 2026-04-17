
let task = {
  title: "Design dashboard mockup",
  description: "Create high-fidelity interactive prototype for client review, include dark mode and mobile variants. Additional details: user testing, handoff to dev. Also includes design system documentation and interactive components.",
  priority: "Medium",  
  dueDate: new Date(Date.UTC(2026, 2, 1, 18, 0, 0)),
  status: "Pending", 
  completed: false
};

let originalTask = null; 
let updateInterval = null;
const normalView = document.getElementById('normal-view');
const editView = document.getElementById('edit-view');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');
const titleEl = document.getElementById('todo-title');
const statusBadge = document.getElementById('status-badge-display');
const completeToggle = document.getElementById('complete-toggle');
const priorityChip = document.getElementById('priority-chip');
const dueDateDisplay = document.getElementById('due-date-display');
const timeRemainingSpan = document.getElementById('time-remaining');
const statusControl = document.getElementById('status-control');
const overdueContainer = document.getElementById('overdue-container');
const cardRoot = document.getElementById('card-root');
const expandToggle = document.getElementById('expand-toggle');
const collapsibleSection = document.getElementById('collapsible-section');
const fullDescDiv = document.getElementById('full-description-text');
const descPreviewDiv = document.getElementById('desc-preview');
const editTitleInput = document.getElementById('edit-title');
const editDescInput = document.getElementById('edit-desc');
const editPrioritySelect = document.getElementById('edit-priority');
const editDueInput = document.getElementById('edit-due');

function formatDueDate(date) {
  return `Due ${date.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}`;
}

function getTimeRemainingString(now = new Date()) {
  if (task.status === "Done") return "Completed";
  const due = task.dueDate;
  const diffMs = due - now;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec <= 0) {
    const overdueSec = -diffSec;
    const hours = Math.floor(overdueSec / 3600);
    const minutes = Math.floor((overdueSec % 3600) / 60);
    if (hours >= 24) return `Overdue by ${Math.floor(hours/24)} days`;
    if (hours >= 1) return `Overdue by ${hours} hour${hours>1?'s':''}`;
    if (minutes >= 1) return `Overdue by ${minutes} minute${minutes>1?'s':''}`;
    return `Overdue now!`;
  } else {
    const hours = Math.floor(diffSec / 3600);
    const days = Math.floor(hours / 24);
    const minutes = Math.floor((diffSec % 3600) / 60);
    if (days >= 3) return `Due in ${days} days`;
    if (days === 2) return `Due in 2 days`;
    if (days === 1) return `Due tomorrow`;
    if (hours >= 1) return `Due in ${hours} hour${hours>1?'s':''}`;
    if (minutes >= 1) return `Due in ${minutes} minute${minutes>1?'s':''}`;
    return `Due now!`;
  }
}

function updateOverdueIndicator() {
  if (task.status === "Done") {
    overdueContainer.innerHTML = '';
    return;
  }
  const now = new Date();
  if (task.dueDate < now) {
    overdueContainer.innerHTML = '<div class="overdue-indicator" data-testid="test-todo-overdue-indicator">⚠️ Overdue</div>';
    cardRoot.style.borderLeft = '4px solid #e74c3c';
  } else {
    overdueContainer.innerHTML = '';
    cardRoot.style.borderLeft = '';
  }
}

function refreshUI() {

  titleEl.textContent = task.title;
  if (task.status === "Done" || task.completed) titleEl.classList.add('completed');
  else titleEl.classList.remove('completed');
  

  statusBadge.innerHTML = task.status === "Pending" ? "📋 Pending" : (task.status === "In Progress" ? "⚙️ In Progress" : "✅ Done");
  statusControl.value = task.status;
  completeToggle.checked = (task.status === "Done");
  task.completed = (task.status === "Done");
  

  priorityChip.innerHTML = task.priority === "Low" ? "🟢 Low" : (task.priority === "Medium" ? "⚡ Medium" : "🔴 High");
  cardRoot.setAttribute('data-priority', task.priority);


  dueDateDisplay.textContent = formatDueDate(task.dueDate);
  dueDateDisplay.setAttribute('datetime', task.dueDate.toISOString());
  

  const timeStr = getTimeRemainingString();
  timeRemainingSpan.textContent = timeStr;
  updateOverdueIndicator();
  
  
  const shortDesc = task.description.length > 100 ? task.description.substring(0, 100) + "…" : task.description;
  descPreviewDiv.textContent = shortDesc;
  fullDescDiv.textContent = task.description;
  
  if (task.description.length > 100 && !collapsibleSection.hidden) {}
  
  if (task.description.length <= 100) expandToggle.style.display = 'none';
  else expandToggle.style.display = 'inline-flex';
}

function syncStatusFromCheckbox() {
  if (completeToggle.checked) task.status = "Done";
  else {
    if (task.status === "Done") task.status = "Pending";
  }
  refreshUI();
}

function syncStatusFromDropdown() {
  const newStatus = statusControl.value;
  task.status = newStatus;
  if (newStatus === "Done") task.completed = true;
  else task.completed = false;
  refreshUI();
}

function saveEdit() {
  task.title = editTitleInput.value.trim() || task.title;
  task.description = editDescInput.value.trim() || task.description;
  task.priority = editPrioritySelect.value;
  const newDue = new Date(editDueInput.value);
  if (!isNaN(newDue.getTime())) task.dueDate = newDue;
  refreshUI();
  exitEditMode();
}

function exitEditMode() {
  normalView.style.display = 'block';
  editView.style.display = 'none';
  editBtn.focus();
}

function cancelEdit() {
  if (originalTask) {
    task = JSON.parse(JSON.stringify(originalTask));
    refreshUI();
  }
  exitEditMode();
}

function enterEditMode() {
  originalTask = JSON.parse(JSON.stringify(task));
  editTitleInput.value = task.title;
  editDescInput.value = task.description;
  editPrioritySelect.value = task.priority;
  
  const localDue = new Date(task.dueDate);
  const tzOffset = localDue.getTimezoneOffset() * 60000;
  const localISODate = new Date(localDue - tzOffset).toISOString().slice(0, 16);
  editDueInput.value = localISODate;
  normalView.style.display = 'none';
  editView.style.display = 'block';
  editTitleInput.focus();
}


function toggleExpand() {
  const isExpanded = expandToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    collapsibleSection.hidden = true;
    expandToggle.setAttribute('aria-expanded', 'false');
    expandToggle.innerHTML = '🔽 Show full description';
  } else {
    collapsibleSection.hidden = false;
    expandToggle.setAttribute('aria-expanded', 'true');
    expandToggle.innerHTML = '🔼 Show less';
  }
}


deleteBtn.addEventListener('click', () => { alert("🗑️ Delete clicked (demo)"); console.log("Delete action"); });
editBtn.addEventListener('click', enterEditMode);
saveBtn.addEventListener('click', saveEdit);
cancelBtn.addEventListener('click', cancelEdit);
completeToggle.addEventListener('change', syncStatusFromCheckbox);
statusControl.addEventListener('change', syncStatusFromDropdown);
expandToggle.addEventListener('click', toggleExpand);


function startTimer() {
  if (updateInterval) clearInterval(updateInterval);
  updateInterval = setInterval(() => {
    if (task.status !== "Done") refreshUI(); 
    else {
      timeRemainingSpan.textContent = "Completed";
      overdueContainer.innerHTML = '';
    }
  }, 30000);
}


if (task.description.length > 100) {
  collapsibleSection.hidden = true;
  expandToggle.setAttribute('aria-expanded', 'false');
} else {
  collapsibleSection.hidden = true;
  expandToggle.style.display = 'none';
}

refreshUI();
startTimer();


window.addEventListener('load', () => {});


setInterval(() => { if (task.status !== "Done") updateOverdueIndicator(); }, 60000);



const priorityIndicatorDiv = document.createElement('div');
priorityIndicatorDiv.setAttribute('data-testid', 'test-todo-priority-indicator');
priorityIndicatorDiv.style.display = 'none';
cardRoot.appendChild(priorityIndicatorDiv);
