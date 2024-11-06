function formatTimeForInput(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

function formatTimeForDisplay(hours, minutes) {
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

function getTimeFromStartSlot(slot) {
  const timeSlots = document.querySelector('.time-slots');
  const slotIndex = Array.from(timeSlots.children).indexOf(slot) - 7;
  // Lấy giờ và phút từ chỉ số của slot 
  const hours = Math.floor(slotIndex / 28);
  const minutes = Math.floor((slotIndex % 28) / 7) * 15;

  // Lấy ngày từ dataset của slot
  const date = slot.dataset.date; // Định dạng ngày 'DD-MM-YYYY'


  // Kết hợp ngày với giờ và phút
  const formattedTime = formatDateTimeForInput(date, hours, minutes);

  return formattedTime; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

function getTimeFromEndSlot(slot) {
  const timeSlots = document.querySelector('.time-slots');
  const slotIndex = Array.from(timeSlots.children).indexOf(slot);
  // Lấy giờ và phút từ chỉ số của slot
  const hours = Math.floor(slotIndex / 28);
  const minutes = Math.floor((slotIndex % 28) / 7) * 15;

  // Lấy ngày từ dataset của slot
  const date = slot.dataset.date; // Định dạng ngày 'DD-MM-YYYY'

  // Kết hợp ngày với giờ và phút
  const formattedTime = formatDateTimeForInput(date, hours, minutes);

  return formattedTime; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

function formatDateTimeForInput(date, hours, minutes) {
  const formattedHours = String(hours).padStart(2, '0'); // Đảm bảo có 2 chữ số cho giờ
  const formattedMinutes = String(minutes).padStart(2, '0'); // Đảm bảo có 2 chữ số cho phút
  return `${date}T${formattedHours}:${formattedMinutes}`; // Trả về định dạng 'YYYY-MM-DDTHH:MM'
}

function getIndexFromTime(time) {
  const dayElements = document.querySelectorAll('.calendar-day');
  const DayIndex = (new Date(formatDate(time)) - new Date(dayElements[0].dataset.date))/(1000 * 60 * 60 * 24);
  const Hour = time.getHours();
  const Minute = time.getMinutes();

  const SlotIndex = (Hour * 4 + Minute / 15) * 7 + DayIndex;
  console.log(`${Hour}-${Minute}-${formatDate(time)}-${dayElements[0].dataset.date}-${DayIndex}`);
  return SlotIndex;
}
