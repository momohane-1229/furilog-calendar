let events = JSON.parse(localStorage.getItem("events")) || [];
let currentDate = new Date();
let editingIndex = null;

function openAddModal(){
  editingIndex = null;

  document.getElementById("modalTitle").textContent = "予定を追加";
  document.getElementById("deleteButton").style.display = "none";

  clearForm();

  document.getElementById("eventModal").classList.add("active");
}

function openEditModal(index){
  editingIndex = index;

  const event = events[index];

  document.getElementById("modalTitle").textContent = "予定を編集";
  document.getElementById("deleteButton").style.display = "inline-block";

  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time;
  document.getElementById("eventType").value = event.type;
  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventTeacher").value = event.teacher;
  document.getElementById("eventPlace").value = event.place;
  document.getElementById("eventMemo").value = event.memo;

  document.getElementById("eventModal").classList.add("active");
}

function closeEventModal(){
  document.getElementById("eventModal").classList.remove("active");
}

function clearForm(){
  document.getElementById("eventDate").value = "";
  document.getElementById("eventTime").value = "";
  document.getElementById("eventType").value = "normal";
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventTeacher").value = "";
  document.getElementById("eventPlace").value = "";
  document.getElementById("eventMemo").value = "";
}

function saveEvents(){
  localStorage.setItem("events", JSON.stringify(events));
}

function saveEvent(){
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const type = document.getElementById("eventType").value;
  const title = document.getElementById("eventTitle").value;
  const teacher = document.getElementById("eventTeacher").value;
  const place = document.getElementById("eventPlace").value;
  const memo = document.getElementById("eventMemo").value;

  if(!date || !title){
    alert("日付と内容を入れてね");
    return;
  }

  const eventData = {
    date,
    time,
    type,
    title,
    teacher,
    place,
    memo
  };

  if(editingIndex === null){
    events.push(eventData);
  }else{
    events[editingIndex] = eventData;
  }

  saveEvents();
  renderCalendar();
  closeEventModal();
}

function deleteEvent(){
  if(editingIndex === null){
    return;
  }

  const result = confirm("この予定を削除する？");

  if(result){
    events.splice(editingIndex, 1);
    saveEvents();
    renderCalendar();
    closeEventModal();
  }
}

function renderCalendar(){
  const calendar = document.getElementById("calendar");
  const monthTitle = document.getElementById("monthTitle");

  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for(let i = 0; i < startDay; i++){
    const empty = document.createElement("div");
    empty.className = "calendar-day";
    calendar.appendChild(empty);
  }

  for(let day = 1; day <= daysInMonth; day++){
    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day";

    const today = new Date();

    if(
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    ){
      dayBox.classList.add("today");
    }

    const dateNumber = document.createElement("div");
    dateNumber.className = "date-number";
    dateNumber.textContent = day;
    dayBox.appendChild(dateNumber);

    const dateString =
      `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    events.forEach((event, index) => {
      if(event.date === dateString){
        const chip = document.createElement("div");
        chip.className = `event-chip type-${event.type}`;

        chip.innerHTML = `
          <strong>${event.title}</strong><br>
          ${event.time || ""} ${event.teacher ? "｜" + event.teacher : ""}
        `;

        chip.onclick = function(){
          openEditModal(index);
        };

        dayBox.appendChild(chip);
      }
    });

    calendar.appendChild(dayBox);
  }
}

function changeMonth(amount){
  currentDate.setMonth(currentDate.getMonth() + amount);
  renderCalendar();
}

function goToday(){
  currentDate = new Date();
  renderCalendar();
}

renderCalendar();