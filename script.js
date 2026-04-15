

const DUE_DATE_UTC = new Date(Date.UTC(2026, 2, 1, 18, 0, 0));

const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingSpan = document.getElementById('time-remaining-display');
const completeToggle = document.getElementById('complete-toggle');
const todoTitle = document.querySelector('.todo-title');
const statusBadge = document.getElementById('status-badge');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');


function formatDueDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
  const formatted = date.toLocaleDateString(undefined, options);
  return `Due ${formatted}`;
}

function getTimeRemainingString(now = new Date()) {
  const due = DUE_DATE_UTC;
  const diffMs = due - now;
  const diffSec = Math.floor(diffMs / 1000);
  const absDiffSec = Math.abs(diffSec);
  
  if (diffSec <= 0) {
    
    const overdueSec = -diffSec;
    const overdueHours = Math.floor(overdueSec / 3600);
    const overdueMinutes = Math.floor((overdueSec % 3600) / 60);
    if (overdueHours >= 24) {
      const overdueDays = Math.floor(overdueHours / 24);
      return `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
    } else if (overdueHours >= 1) {
      return `Overdue by ${overdueHours} hour${overdueHours !== 1 ? 's' : ''}`;
    } else if (overdueMinutes >= 1) {
      return `Overdue by ${overdueMinutes} minute${overdueMinutes !== 1 ? 's' : ''}`;
    } else {
      return `Overdue now!`;
    }
  } else {
    
    const hoursRemaining = Math.floor(diffSec / 3600);
    const daysRemaining = Math.floor(hoursRemaining / 24);
    const remainingHours = hoursRemaining % 24;
    const remainingMinutes = Math.floor((diffSec % 3600) / 60);
    
    if (daysRemaining >= 3) {
      return `Due in ${daysRemaining} days`;
    } else if (daysRemaining === 2) {
      return `Due in 2 days`;
    } else if (daysRemaining === 1) {
      return `Due tomorrow`;
    } else if (hoursRemaining >= 1) {
      return `Due in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`;
    } else if (remainingMinutes >= 1) {
      return `Due in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else {
      return `Due now!`;
    }
  }
}

function updateTimeRemaining() {
  const remainingStr = getTimeRemainingString(new Date());
  
  if (timeRemainingSpan) {
      timeRemainingSpan.textContent = remainingStr;

      if (remainingStr.startsWith("Overdue")) {
          timeRemainingSpan.classList.add("overdue");
      } else {
          timeRemainingSpan.classList.remove("overdue");
      }
  }
}


if (dueDateElement) {
  dueDateElement.textContent = formatDueDate(DUE_DATE_UTC);
  
  dueDateElement.setAttribute('datetime', DUE_DATE_UTC.toISOString());
}


updateTimeRemaining();
let intervalId = setInterval(() => {
  updateTimeRemaining();
}, 30000);


function updateCompletionState() {
  const isChecked = completeToggle.checked;
  if (isChecked) {
    todoTitle.classList.add('completed');
    statusBadge.innerHTML = '✅ Done';
    statusBadge.setAttribute('aria-label', 'Current status: Done');

  } else {
    todoTitle.classList.remove('completed');
    statusBadge.innerHTML = '📋 Pending';
    statusBadge.setAttribute('aria-label', 'Current status: Pending');
  }
}


completeToggle.addEventListener('change', updateCompletionState);

updateCompletionState();
editBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("[Edit] Edit button clicked – current task: 'Design dashboard mockup'");
  alert("✏️ Edit action: In a real app, you could edit title/description etc. (Demo mode)");
});

deleteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("[Delete] Delete button triggered");
  const userConfirm = confirm("⚠️ Delete this task? (Demo: task will NOT be removed from UI, but action is registered)");
  if (userConfirm) {
    alert("🗑️ Delete confirmed! (UI remains for test visibility)");
  } else {
    console.log("Delete cancelled");
  }
});
  window.addEventListener('beforeunload', () => {
  if (intervalId) clearInterval(intervalId);
});



console.log("✅ Todo card ready | data-testid all present | WCAG + responsive ready");


