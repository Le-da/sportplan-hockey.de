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

const PLAN_DAYS = ['mon','die','mit','don','fre','sam','son'];

const EXERCISES = {
    'Beintraining':          ['Squats', 'Lunges', 'Box Jumps'],
    'Bauchtraining':         ['Plank', 'Russian Twists', 'Bicycle Crunches'],
    'Oberkörpertraining':    ['Push-ups', 'Pull-ups', 'Shoulder Press'],
    'Cardio':                ['Joggen', 'Intervalltraining', 'Radfahren'],
    'Feldhockey-spezifisch': ['Schuss-Training', 'Pass-Übungen', 'Agility Drills'],
    'Pause / Ruhetag':       []
};

function updateExercises(day, selectedValues) {
    const cat = document.getElementById('einheit-' + day).value;
    const sub = document.getElementById('uebung-' + day);
    sub.innerHTML = '';
    const list = EXERCISES[cat] || [];
    if (list.length === 0) {
        sub.disabled = true;
        return;
    }
    list.forEach(ex => {
        const opt = document.createElement('option');
        opt.value = ex;
        opt.textContent = ex;
        if (Array.isArray(selectedValues) && selectedValues.includes(ex)) opt.selected = true;
        sub.appendChild(opt);
    });
    sub.disabled = false;
    sub.size = list.length;
}

function savePlan() {
    const plan = {};
    PLAN_DAYS.forEach(day => {
        const sub = document.getElementById('uebung-' + day);
        plan[day] = {
            einheit: document.getElementById('einheit-' + day).value,
            uebung:  Array.from(sub.selectedOptions).map(o => o.value),
            ziel:    document.getElementById('ziel-' + day).value
        };
    });
    localStorage.setItem('trainingsplan', JSON.stringify(plan));
    const btn = document.querySelector('.plan-btn');
    const orig = btn.textContent;
    btn.textContent = 'Gespeichert!';
    setTimeout(() => btn.textContent = orig, 1500);
}

function loadPlan() {
    const saved = localStorage.getItem('trainingsplan');
    if (!saved) return;
    const plan = JSON.parse(saved);
    PLAN_DAYS.forEach(day => {
        if (plan[day]) {
            document.getElementById('einheit-' + day).value = plan[day].einheit || '';
            if (plan[day].einheit) updateExercises(day, plan[day].uebung || '');
            document.getElementById('ziel-' + day).value = plan[day].ziel || '';
        }
    });
}

function resetPlan() {
    if (!confirm('Trainingsplan wirklich zurücksetzen?')) return;
    localStorage.removeItem('trainingsplan');
    PLAN_DAYS.forEach(day => {
        document.getElementById('einheit-' + day).value = '';
        const sub = document.getElementById('uebung-' + day);
        sub.innerHTML = '';
        sub.disabled = true;
        sub.size = 1;
        document.getElementById('ziel-' + day).value = '';
    });
}

// Default open first tab
document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName("tab")[0].click();
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('exerciseModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    loadPlan();
});
