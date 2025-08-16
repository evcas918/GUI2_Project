function addCalendarTab() {
  // Html for the button and prompt
  if (!document.getElementById("eventModal")) {
    const modalHTML = `
      <div id="eventModal" class="modal" style="display:none;">
        <div class="modal-content">
          <p id="modalText"></p>
          <div id="modalInputContainer" style="display:none;">
            <input id="modalInput" type="text" placeholder="Event title">
          </div>
          <div class="modal-buttons">
            <button id="addEventBtn">Add</button>
            <button id="deleteEventsBtn">Delete All</button>
            <button id="cancelBtn">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById("eventModal");
  const modalText = document.getElementById("modalText");
  const modalInputContainer = document.getElementById("modalInputContainer");
  const modalInput = document.getElementById("modalInput");
  const addBtn = document.getElementById("addEventBtn");
  const deleteBtn = document.getElementById("deleteEventsBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  function showEventModal(datesArray, existingEvents, calendar) {
    const modal = document.getElementById("eventModal");
    const modalText = document.getElementById("modalText");

    // --- Create input container if not exist ---
    let modalInputContainer = document.getElementById("modalInputContainer");
    if (!modalInputContainer) {
      modalInputContainer = document.createElement("div");
      modalInputContainer.id = "modalInputContainer";
      modalInputContainer.style.display = "none";
      modalInputContainer.style.marginTop = "10px";

      const modalInput = document.createElement("input");
      modalInput.id = "modalInput";
      modalInput.type = "text";
      modalInput.placeholder = "Event title...";
      modalInput.style.padding = "8px";
      modalInput.style.width = "100%";
      modalInput.style.borderRadius = "6px";
      modalInput.style.border = "1px solid #ccc";
      modalInput.style.fontSize = "14px";

      modalInputContainer.appendChild(modalInput);
      modal.querySelector(".modal-content").appendChild(modalInputContainer);
    }

    const addBtn = document.getElementById("addEventBtn");
    const deleteBtn = document.getElementById("deleteEventsBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const modalInput = document.getElementById("modalInput");

    // Text and delete button visibility 
    if (existingEvents.length === 0) {
      modalText.textContent = `No events on this date.`;
      deleteBtn.style.display = "none";
    } else {
      modalText.textContent = `There are ${existingEvents.length} event(s) on this date.`;
      deleteBtn.style.display = "inline-block";
    }

    modal.style.display = "flex"; // center modal

    // --- Clear previous click handlers ---
    addBtn.onclick = deleteBtn.onclick = cancelBtn.onclick = null;

    // button logic
    addBtn.onclick = () => {
      modalInputContainer.style.display = "block";
      modalInput.focus();

    const addEvents = () => {
  const titleInput = modalInput.value.trim();
  if (!titleInput) return;

if (datesArray.length === 1) {
  // Single date
  calendar.addEvent({
    title: titleInput,
    start: datesArray[0],
    allDay: true
  });
} else {
  // Multi-day event
  const start = datesArray[0];
  
  // Create new Date from last date, add 1 day, convert back to string
  const lastDate = new Date(datesArray[datesArray.length - 1]);
  lastDate.setDate(lastDate.getDate() + 1);
  const end = lastDate.toISOString().split('T')[0];

  calendar.addEvent({
    title: titleInput,
    start: start,
    end: end,  // exclusive end includes all selected days
    allDay: true
  });
}

  // Reset modal
  modalInput.value = "";
  modalInputContainer.style.display = "none";
  modal.style.display = "none";
};


      addBtn.onclick = addEvents; // redefine click to actually add
      modalInput.onkeydown = (e) => {
        if (e.key === "Enter") addEvents();
      };
    };

    // Delete button 
    deleteBtn.onclick = () => {
      existingEvents.forEach(e => e.remove());
      modal.style.display = "none";
      modalInputContainer.style.display = "none";
      modalInput.value = "";
    };

    // Cancel button
    cancelBtn.onclick = () => {
      modal.style.display = "none";
      modalInputContainer.style.display = "none";
      modalInput.value = "";
    };
  }

  const $calendarWrapper = $(`
    <div id="calendarWrapper" style="width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:center;">
      <div id="calendarScaleContainer" style="transform-origin: top left; width:100%; height:100%;">
        <div id="calendar"></div>
      </div>
    </div>
  `);

  addTab($(this), "Calendar", $calendarWrapper);

  // FullCalendar initialization
  setTimeout(() => {
    const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev next today multiMonthButton',
        center: 'title',
        right: 'dayGridMonth timeGridWeek'
      },
      customButtons: {
        multiMonthButton: {
          text: 'Year',
          click: function() {
            calendar.changeView('multiMonthYear');
          }
        }
      },
      aspectRatio: 2,
      height: '100%',
      contentHeight: '100%',
      selectable: true,
      selectHelper: true,

      dateClick: function(info) {
        const clickedDate = new Date(info.date);
        clickedDate.setHours(0, 0, 0, 0);

        const eventsOnDate = calendar.getEvents().filter(event => {
          const start = new Date(event.start);
          const end = event.end ? new Date(event.end) : new Date(event.start);
          start.setHours(0,0,0,0);
          end.setHours(0,0,0,0);

          if (!event.end) end.setDate(end.getDate() + 1);

          return clickedDate >= start && clickedDate < end;
        });

        showEventModal([info.dateStr], eventsOnDate, calendar);
      },

     select: function(info) {
  // info.start and info.end are Date objects
  // FullCalendar's info.end is exclusive

  // Build array of selected dates using dateStr to avoid timezone issues
  const datesArray = [];
  let current = info.start;
  while (current < info.end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2,'0');
    const d = String(current.getDate()).padStart(2,'0');
    datesArray.push(`${y}-${m}-${d}`);

    current.setDate(current.getDate() + 1);
  }

  // Find overlapping events
  const existingEvents = calendar.getEvents().filter(event => {
    const evStart = event.startStr;
    const evEnd = event.endStr || event.startStr;
    // Compare as strings (YYYY-MM-DD) for all-day events
    return datesArray.some(date => date >= evStart && date < evEnd);
  });

  showEventModal(datesArray, existingEvents, calendar);
  calendar.unselect();
}

    });

    calendar.render();

    function updateCalendarScale() {
      const wrapper = document.getElementById("calendarWrapper");
      const scaleContainer = document.getElementById("calendarScaleContainer");
      const calendarEl = document.getElementById("calendar");
      if (!wrapper || !scaleContainer || !calendarEl) return;

      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;
      const contentWidth = calendarEl.scrollWidth || calendarEl.offsetWidth;
      const contentHeight = calendarEl.scrollHeight || calendarEl.offsetHeight;
      if (contentWidth === 0 || contentHeight === 0) return;

      const scaleX = wrapperWidth / contentWidth;
      const scaleY = wrapperHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY);

      scaleContainer.style.transform = `scale(${scale})`;
    }

    setTimeout(updateCalendarScale, 50);
    window.addEventListener("resize", updateCalendarScale);

  }, 0);
}
