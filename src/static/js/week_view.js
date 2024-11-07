let currentWeek = getStartOfCenteredWeek(new Date());
let endWeek = new Date();

function initializeCalendar() {
  const timeSlots = document.querySelector('.time-slots');
  const timeInterval = document.querySelector('.time_interval .time');

  // Xóa các phần tử thời gian hiện có
  timeSlots.innerHTML = ''; // Xóa tất cả các phần tử trong .time-slots
  timeInterval.innerHTML = ''; // Xóa tất cả các phần tử trong .time_interval .time

  updateCalendarDisplay();
  createTimeIntervalsAndSlots();

  timeSlots.addEventListener('mousedown', onMouseDown);
  timeSlots.addEventListener('mousemove', onMouseMove);
  // timeSlots.addEventListener('click', onMouseClick);
  document.addEventListener('mouseup', onMouseUp);
}

function createTimeIntervalsAndSlots() {
  const timeSlots = document.querySelector('.time-slots');
  const timeInterval = document.querySelector('.time_interval .time');
  const dayElements = document.querySelectorAll('.calendar-day');

  // Create blank space at the start
  const timeblank1 = document.createElement('div');
  timeblank1.classList.add('blank_time');
  timeInterval.appendChild(timeblank1);

  for (let j = 0; j < 7; j++) {
    const timeSlot = document.createElement('div');
    timeSlot.style.height = '30px';
    timeSlot.style.borderRight = '1px solid #ddd';
    timeSlots.appendChild(timeSlot);
  }

  for (let i = 0; i < 96; i++) {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    const timeElement = document.createElement('p');

    if (i % 4 === 0) {
      timeElement.textContent = formatTimeForDisplay(hours, minutes);
    }
    timeInterval.appendChild(timeElement);

    dayElements.forEach((dayElement, j) => {
      const timeSlot = document.createElement('div');
      timeSlot.classList.add('time-slot');

      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + j);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      timeSlot.dataset.date = `${year}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      timeSlot.dataset.time = formatTimeForInput(hours, minutes);
      timeSlot.dataset.day = j;
      if (i % 4 === 1 || i % 4 === 3) {
        timeSlot.style.borderTop = '0px solid';
      }

      timeSlots.appendChild(timeSlot);
    });
  }

  const timeblank2 = document.createElement('div');
  timeblank2.classList.add('blank_time');
  timeInterval.appendChild(timeblank2);
}

function previousWeek() {
  currentWeek.setDate(currentWeek.getDate() - 7);
  endWeek.setDate(currentWeek.getDate() + 6);
  initializeCalendar();
}

function nextWeek() {
  currentWeek.setDate(currentWeek.getDate() + 7);
  endWeek.setDate(currentWeek.getDate() + 6);
  initializeCalendar();
}

function updateCalendarDisplay() {
  const currentDate = new Date();
  const weekStart = currentWeek;
  const dayElements = document.querySelectorAll('.calendar-day');
  const dayOfWeekElements = document.querySelectorAll('.day_of_week');

  let startMonth = null;
  let startYear = null;
  let endMonth = null;
  let endYear = null;

  dayElements.forEach((element, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    // Hiển thị ngày trong tuần
    element.textContent = date.getDate().toString().padStart(2, '0');
    element.dataset.date = formatDate(date);
    if (date.toDateString() === currentDate.toDateString()) {
      element.style.color = '#4361ee';
      element.style.fontWeight = 'bold';
    }

    // Lấy thông tin ngày trong tuần
    const dayOfWeek = getDayOfWeek(date);
    dayOfWeekElements[index].textContent = dayOfWeek;

    // Xác định tháng và năm bắt đầu và kết thúc trong tuần
    if (index === 0) {
      startMonth = date.getMonth() + 1;
      startYear = date.getFullYear();
    }
    if (index === dayElements.length - 1) {
      endMonth = date.getMonth() + 1;
      endYear = date.getFullYear();
    }
  });

  // Hiển thị tháng và năm trên phần đầu lịch
  const dayElement = document.querySelector('.day p');
  if (startMonth === endMonth && startYear === endYear) {
    // Nếu cùng tháng và năm
    dayElement.textContent = `Tháng ${startMonth
      .toString()
      .padStart(2, '0')}, ${startYear}`;
  } else {
    // Nếu khác tháng hoặc khác năm
    dayElement.textContent = `Tháng ${startMonth
      .toString()
      .padStart(2, '0')} - ${endMonth.toString().padStart(2, '0')}, ${endYear}`;
  }
}

//Tìm ngày chủ nhật gần nhất
function getStartOfCenteredWeek(date) {
  const start = new Date(date);
  const day = start.getDay(); // Ngày trong tuần (0 - Chủ Nhật, 1 - Thứ Hai, ... 6 - Thứ Bảy)
  const offset = day === 0 ? 0 : -day; // Nếu là Chủ Nhật thì không cần dịch, nếu không thì dịch về Chủ Nhật
  start.setDate(start.getDate() + offset); // Thiết lập ngày về Chủ Nhật gần nhất
  return start;
}

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function getDayOfWeek(date) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[date.getDay()];
}

let isDragging = false;
let startSlot = null;
let endSlot = null;

function onMouseDown(e) {
  if (e.target.classList.contains('time-slot')) {
    isDragging = true;
    startSlot = e.target;
    endSlot = e.target;
    highlightSlot(startSlot);
  }
}

function onMouseMove(e) {
  if (isDragging && e.target.classList.contains('time-slot')) {
    endSlot = e.target;
    highlightRange(startSlot, endSlot);
  }
}

function onMouseUp() {
  if (isDragging) {
    isDragging = false;
    if (startSlot && endSlot) {
      const startTime = getTimeFromStartSlot(startSlot);
      const endTime = getTimeFromEndSlot(endSlot);
      console.log(startTime);
      console.log(endTime);
      document.getElementById('startTime').value = startTime;
      console.log(startTime);
      document.getElementById('endTime').value = endTime;
      openCreateTaskModal();
    }
    clearHighlight();
  }
}

// Hightlight ô
function highlightSlot(slot) {
  slot.classList.add('highlighted');
}

// Highlight theo range
function highlightRange(start, end) {
  clearHighlight();
  const slots = Array.from(document.querySelectorAll('.time-slot'));
  const startIndex = slots.indexOf(start);
  const endIndex = slots.indexOf(end);

  const [row1, row2] = [
    Math.floor(startIndex / 7) - 1,
    Math.floor(endIndex / 7),
  ].sort((a, b) => a - b);
  const [col1, col2] = [startIndex % 7, endIndex % 7].sort((a, b) => a - b);

  for (let i = row1 + 1; i <= row2; i++) {
    for (let j = col1; j <= col2; j++) {
      slots[i * 7 + j].classList.add('highlighted');
    }
  }
}

// Bỏ highlight các ô
function clearHighlight() {
  document
    .querySelectorAll('.highlighted')
    .forEach((slot) => slot.classList.remove('highlighted'));
}
