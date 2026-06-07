import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAj5hNKDRiyBtFARxgRqKvA-o59OnZW6k",
  authDomain: "furilog-calender.firebaseapp.com",
  projectId: "furilog-calender",
  storageBucket: "furilog-calender.firebasestorage.app",
  messagingSenderId: "781255997751",
  appId: "1:781255997751:web:4b1801af0bbbcfd99b02b2",
  measurementId: "G-VD9ZVVRZRP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let events = [];
let currentDate = new Date();
let editingIndex = null;

async function loadEvents(){
  events = [];

  const querySnapshot = await getDocs(collection(db, "events"));

  querySnapshot.forEach((document) => {
    events.push({
      id: document.id,
      ...document.data()
    });
  });

  renderCalendar();
}

function openAddModal(selectedDate = ""){
  editingIndex = null;

  document.getElementById("modalTitle").textContent = "予定を追加";
  document.getElementById("deleteButton").style.display = "none";

  clearForm();

  if(selectedDate){
    document.getElementById("eventDate").value = selectedDate;
  }

  document.getElementById("eventModal").classList.add("active");
}

function openEditModal(index){
  editingIndex = index;

  const event = events[index];

  document.getElementById("modalTitle").textContent = "予定を編集";
  document.getElementById("deleteButton").style.display = "inline-block";

  document.getElementById("eventDate").value = event.date || "";
  document.getElementById("eventTime").value = event.time || "";
  document.getElementById("eventType").value = event.type || "normal";
  document.getElementById("eventTitle").value = event.title || "";
  document.getElementById("eventTeacher").value = event.teacher || "";
  document.getElementById("eventPlace").value = event.place || "";
  document.getElementById("eventMemo").value = event.memo || "";

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

async function saveEvent(){
  const eventData = {
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    type: document.getElementById("eventType").value,
    title: document.getElementById("eventTitle").value,
    teacher: document.getElementById("eventTeacher").value,
    place: document.getElementById("eventPlace").value,
    memo: document.getElementById("eventMemo").value
  };

if(!eventData.date || !eventData.teacher){
  alert("日付と担当者を入れてね");
  return;
}
  if(editingIndex === null){
    await addDoc(collection(db, "events"), eventData);
  }else{
    const targetEvent = events[editingIndex];
    await updateDoc(doc(db, "events", targetEvent.id), eventData);
  }

  await loadEvents();
  closeEventModal();
}

async function deleteEvent(){
  if(editingIndex === null){
    return;
  }

  const result = confirm("この予定を削除する？");

  if(result){
    const targetEvent = events[editingIndex];
    await deleteDoc(doc(db, "events", targetEvent.id));

    await loadEvents();
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

    const dateString =
      `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    dayBox.onclick = function(){
      openAddModal(dateString);
    };

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

    events.forEach((event, index) => {
      if(event.date === dateString){
        const chip = document.createElement("div");
        chip.className = `event-chip type-${event.type}`;

        chip.innerHTML = `
          <strong>${event.teacher || "担当未定"}</strong>
        `;

        chip.onclick = function(e){
          e.stopPropagation();
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

window.openAddModal = openAddModal;
window.closeEventModal = closeEventModal;
window.saveEvent = saveEvent;
window.deleteEvent = deleteEvent;
window.changeMonth = changeMonth;
window.goToday = goToday;

loadEvents();