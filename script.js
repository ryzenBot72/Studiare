//--------------------After the Sign Up-------------------
const signUpForm = document.getElementById('signUpForm');

if(signUpForm){
    signUpForm.addEventListener('submit', function(event){
      event.preventDefault();//stop the form from getting submitted by default

      const username = document.getElementById('newUserName').value;
      const password = document.getElementById('newPassword').value;

      //Store in local storage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      alert('Sign Up Successful!! You can now sign in.');
      window.location.href = 'sign-in.html';//Redirect to Sign-In Page.
    });
}

//--------------------After the Sign In-------------------
const signInForm = document.getElementById('signInForm');

if(signInForm){
    signInForm.addEventListener('submit', function(event){
      event.preventDefault();

      const username = document.getElementById('inputUserName').value;
      const password = document.getElementById('password').value;

      const storedUsername = localStorage.getItem('username');
      const storedPassword = localStorage.getItem('password');

      if(username == storedUsername && password == storedPassword){
        alert('Sign-In Successful');
        window.location.href = 'dashboard.html';
      } else{
        alert('Invalid Credentials. Please try again');
      }
    });
}

//---Fetch username from localStorage and display it-------
const nameDisplay = document.getElementById('displayUserName');
if(nameDisplay) {
    const userName = localStorage.getItem('username');
    if(userName){
      nameDisplay.textContent = userName;
    } else {
      //if no username found then redirect back to sign-in page.
      window.location.href = 'sign-in.html';
    }
}

//-----------------Handle the logout functionality------------------
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
    logoutBtn.addEventListener('click', function(){
      //Clear the localStorage to log the user out
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      //Redirect to the sign-in page
      window.location.href = 'sign-in.html';
    });
}

// Handle the Assignments Input
const assForm = document.getElementById('assForm');
if (assForm) {
    assForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const assName = document.getElementById('assName').value;
        const assSub = document.getElementById('assSub').value;
        const assDate = document.getElementById('assDate').value;

        // Create an object for the assignment info
        const assignment = {
            name: assName,
            subject: assSub,
            dueDate: assDate
        };

        // Get existing assignments from LocalStorage (if any)
        let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

        // Add the new assignment
        assignments.push(assignment);

        // Update the new assignments array in LocalStorage
        localStorage.setItem('assignments', JSON.stringify(assignments));

        // Call the function to display updated assignments
        displayAssignments();

        // Reset the form
        assForm.reset();
    });
}

// Function to display assignments
function displayAssignments() {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assList = document.getElementById('assignmentList');

    if (assList) {
        assList.innerHTML = '';

        assignments.forEach(function(assignment, index) {
            const div = document.createElement('div');
            div.classList.add('assignment-entry'); // Use this class to style each box

            div.innerHTML = `
                <h3>${assignment.name}</h3>
                <p><strong>Subject:</strong> ${assignment.subject}</p>
                <p><strong>Due Date:</strong> ${assignment.dueDate}</p>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;

            assList.appendChild(div);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const index = button.getAttribute('data-index');
                deleteAssignment(index);
            });
        });
    }
}

// Function to delete an individual assignment
function deleteAssignment(index) {
    // Get existing assignments from LocalStorage
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

    // Remove the assignment at the given index
    assignments.splice(index, 1);

    // Save the updated assignments array in LocalStorage
    localStorage.setItem('assignments', JSON.stringify(assignments));

    // Re-render the list of assignments
    displayAssignments();
}


//------------------ Show Assignments when page loads -----------------
const assList = document.getElementById('assignmentList');
if (assList) {
    displayAssignments();
}

//------------------ Handle notes Input -----------------
const noteForm = document.getElementById('noteForm');
if (noteForm) {
    noteForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const noteTitle = document.getElementById('noteTitle').value.trim();
        const noteText = document.getElementById('noteText').value.trim();
        
        if (!noteTitle || !noteText) return;

        const note = {
            title: noteTitle,
            text: noteText,
            timestamp: new Date().toLocaleString()
        };

        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        noteForm.reset();
    });
}

function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    if (notesList) {
        notesList.innerHTML = '';
        notes.forEach(function (note, index) {
            const div = document.createElement('div');
            div.classList.add('note-card'); // matches your styled class

            div.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.text}</p>
                <small><i>${note.timestamp}</i></small>
                <button class="delete-btn" data-index="${index}">✖</button>
            `;
            notesList.appendChild(div);
        });

        const deleteNoteButtons = document.querySelectorAll('.delete-btn');
        deleteNoteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const index = button.getAttribute('data-index');
                deleteNote(index);
            });
        });
    }
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}


//------------------ Show Notes when page loads -----------------
const notesList = document.getElementById('notesList');
if (notesList) {
    displayNotes();
}

//------------------ Handle Pomodoro Timer -----------------
let sessionCount = 0; // Start the session count at 0

function updateSessionCount() {
  sessionCount++; // Increment the session count by 1
  document.getElementById('sessionCount').textContent = `Sessions Completed: ${sessionCount}`; 
}

function showEncouragingMessage() {
    const messages = [
        "Great job! 🎉",
        "You're doing amazing! 💪",
        "Keep up the momentum! 🔥",
        "You nailed it! ✅",
        "One step closer to your goals! 🚀"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    alert(messages[randomIndex]);
}

let timer;
let isTimerRunning = false;
let remainingTimer = 25 * 60;
let isWorkMode = true;
let workSessionCount = 0;
const timerDisplay = document.getElementById('timer');
const mode = document.getElementById('mode');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

function updateProgressBar() {
    const totalDuration = isWorkMode
      ? 25 * 60
      : (workSessionCount % 4 === 0 ? 15 * 60 : 5 * 60);
    const percentage = ((totalDuration - remainingTimer) / totalDuration) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

function changeBackgroundColor() {
    const pomodoroPage = document.getElementById('pomodoroPage');
    if (isWorkMode) {
      pomodoroPage.style.backgroundColor = "#DFF5E1";
    } else {
      if (workSessionCount % 4 === 0) {
        pomodoroPage.style.backgroundColor = "#E1D5FB";
      } else {
        pomodoroPage.style.backgroundColor = "#FFE0B2";
      }
    }
  }

// Update the display with the remaining time
function updateTimeDisplay() {
    const minutes = Math.floor(remainingTimer / 60);
    const seconds = remainingTimer % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
// Start the timer
function startTimer() {
    if (!isTimerRunning) {
      timer = setInterval(function() {
        remainingTimer--;
        updateTimeDisplay();
        updateProgressBar();

        if (remainingTimer <= 0) {
            clearInterval(timer);
            isTimerRunning = false;
            alert(`${isWorkMode ? "Work" : "Break"} session is over!`);
        
            if (isWorkMode) {
              workSessionCount++;
              updateSessionCount();
              showEncouragingMessage();
              updateProgressBar();
              isWorkMode = false;
        
              // Check if 4 work sessions completed
              if (workSessionCount % 4 === 0) {
                remainingTimer = 15 * 60; // 15 minutes long break
                mode.textContent = "Long Break";
              } else {
                remainingTimer = 5 * 60; // 5 minutes short break
                mode.textContent = "Break";
              }
            } else {
              isWorkMode = true;
              remainingTimer = 25 * 60; // 25 minutes work time
              mode.textContent = "Work";
            }
        
            updateTimeDisplay();
            changeBackgroundColor();
            updateProgressBar();
            resetBtn.disabled = false;
        }
      }, 1000);

      isTimerRunning = true;
      startBtn.disabled = true; // Disable start button while timer is running
      pauseBtn.disabled = false; // Enable pause button
      resetBtn.disabled = false;
    }
}

// Pause the timer
function pauseTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    startBtn.disabled = false; // Enable start button to resume
    pauseBtn.disabled = true;  // Disable pause button while timer is paused
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    remainingTimer = 25 * 60; // Reset to 25 minutes for Work mode
    mode.textContent = "Work";
    updateTimeDisplay();
    changeBackgroundColor();
    updateProgressBar();
    startBtn.disabled = false; // Enable start button after reset
    pauseBtn.disabled = true;  // Disable pause button after reset
    resetBtn.disabled = true;  // Disable reset button after reset
}

// Add event listeners to buttons
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize the timer display
updateTimeDisplay();
changeBackgroundColor();
updateProgressBar();