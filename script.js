let timerInterval = null;
let timeLeft = 0;

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openExerciseModal(exerciseName, imageSvg, duration) {
    const modal = document.getElementById('exerciseModal');
    document.getElementById('exerciseName').textContent = exerciseName;
    document.getElementById('exerciseImage').innerHTML = imageSvg;
    timeLeft = duration;
    updateTimerDisplay();
    modal.classList.add('show');
    stopTimer();
}

function closeModal() {
    document.getElementById('exerciseModal').classList.remove('show');
    stopTimer();
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            stopTimer();
            playSound();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function playSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==');
    audio.play().catch(e => console.log('Sound play failed'));
}

// Default open first tab
document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName("tab")[0].click();
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('exerciseModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
});
