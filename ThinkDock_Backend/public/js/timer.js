function addTimerTab() {
  // Shared styles for timer display/input
  const timerDisplayStyles = {
    fontSize: "48px",
    width: "280px",
    textAlign: "center",
    backgroundColor: "#222",
    color: "#fff",
    border: "2px solid #666",
    borderRadius: "6px",
    outline: "none",
    fontFamily: "'Arial Rounded MT Bold', Arial Rounded, Arial, sans-serif", // updated
    marginBottom: "30px"
  };

  // Create container
  const $timerContainer = $("<div>")
    .addClass("timer-container")
    .css({
      padding: "20px",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      boxSizing: "border-box",
      fontFamily: "'Arial Rounded MT Bold', Arial Rounded, Arial, sans-serif" // updated
    });

  // Timer display and buttons
  $timerContainer.html(`
    <div id="timer-display" style="font-size: 48px; margin-bottom: 30px; cursor: pointer;">25:00</div>
    <div>
      <button id="start-btn" style="margin-right:10px;">Start</button>
      <button id="reset-btn">Reset</button>
    </div>
  `);

  // Tab setup
  const $timerTab = newTab("Timer", $timerContainer);
  $("." + classButtonTabAdd).before($timerTab);
  tabSiblingsClearSelection.call($timerTab);
  tabSelect.call($timerTab);
  const $tabTitle = $timerTab.children("." + classTabTitle);

  // Timer state
  let timerInterval = null;
  const defaultSeconds = 25 * 60;
  let customTotalSeconds = defaultSeconds;
  let remainingSeconds = customTotalSeconds;

  const $display = $timerContainer.find("#timer-display");
  const $start = $timerContainer.find("#start-btn");
  const $reset = $timerContainer.find("#reset-btn");

  // Helpers
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function parseTime(str) {
    const parts = str.split(":");
    if (parts.length !== 2) return null;
    const m = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) return null;
    return m * 60 + s;
  }

  function updateDisplay() {
    const formatted = formatTime(remainingSeconds);
    $display.text(formatted);
    $tabTitle.text(`Timer: ${formatted}`);
  }
  
  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    $start.text("Start");
  }

  // Timer control
  function toggleTimer() {
    if (timerInterval) {
      stopTimer();
    } else {
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          stopTimer();
          alert("Timer finished! Take a break.");
          remainingSeconds = customTotalSeconds;
          updateDisplay();
        }
      }, 1000);
      $start.text("Pause");
    }
  }
  function resetTimer() {
    stopTimer();
    remainingSeconds = customTotalSeconds;
    updateDisplay();
  }

  // Editable display logic
  function showEditInput() {
    stopTimer();
    if ($timerContainer.find("input#timer-input").length > 0) return;
    const $input = $("<input>")
      .attr("type", "text")
      .attr("id", "timer-input")
      .val(formatTime(remainingSeconds))
      .css(timerDisplayStyles);

    $display.hide();
    $display.after($input);
    $input.focus();

    function finishEdit() {
      const val = $input.val();
      const seconds = parseTime(val);
      if (seconds !== null) {
        customTotalSeconds = seconds;
        remainingSeconds = seconds;
        updateDisplay();
      }
      $input.remove();
      $display.show();
    }

    $input.on("blur", finishEdit);
    $input.on("keydown", (e) => {
      if (e.key === "Enter") finishEdit();
      else if (e.key === "Escape") {
        $input.remove();
        $display.show();
      }
    });
  }

  // Bind events
  $display.on("click", showEditInput);
  $start.on("click", toggleTimer);
  $reset.on("click", resetTimer);

  // Init
  updateDisplay();
}