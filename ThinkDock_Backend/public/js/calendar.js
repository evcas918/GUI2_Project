function addCalendarTab() {
  const $calendarEl = $("<div>") // basic scaling
    .attr("id", "calendar")
    .css({
      padding: "10px",
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
      color: "white"
    });

  // OLD
  // const $calendarTab = newTab("Calendar", $calendarEl); 
  //
  // $("." + classButtonTabAdd).before($calendarTab);
  //
  // tabSiblingsClearSelection.call($calendarTab);
  // tabSelect.call($calendarTab);
  // 
  
  // New
  addTab($(this), "Calendar", $calendarEl);
  


  setTimeout(() => {                                                    // refreshes and rerenders the calendar
    const calendar = new FullCalendar.Calendar($calendarEl[0], {        
        initialView: 'dayGridMonth',                                    // setting basic look of calendar
        headerToolbar: {                                                // buttons on header of calendar
            left: 'prev next today multiMonthButton',
            center: 'title',
            right: 'dayGridMonth timeGridWeek'                         
    },
    customButtons: {                                                    // multi year button 
        multiMonthButton: {
            text: 'Year',
            click: function() {
            calendar.changeView('multiMonthYear');
            }   
        }
    },

        aspectRatio: 2,                                         
        height: '100%',
        selectable: true,
        select: function(info) {
        const title = prompt("Enter Event Title:");                    // highlights and able to select and add events to calendar
        if (title) {
          calendar.addEvent({
            title: title,
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay
          });
        }
        calendar.unselect();
      }
    });
    calendar.render();
  }, 0);
}