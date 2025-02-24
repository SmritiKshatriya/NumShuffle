class PINVerification {
    constructor() {
        this.targetPIN = '';
        this.currentInput = '';
        this.timerInterval = null;
        this.shuffleTimeout = null;
        this.timeLeft = 30;
        this.attempts = 0;

        // DOM Elements
        this.targetPinElement = document.getElementById('targetPin');
        this.pinInputElement = document.getElementById('pinInput');
        this.keypadElement = document.getElementById('keypad');
        this.timerBarElement = document.getElementById('timerBar');
        this.statusMessageElement = document.getElementById('statusMessage');
        this.clearBtn = document.getElementById('clearBtn');
        this.backspaceBtn = document.getElementById('backspaceBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.attemptCountElement = document.getElementById('attemptCount');
        this.successPopup = document.getElementById('successPopup');
        this.successPin = document.getElementById('successPin');
        this.closePopupBtn = document.getElementById('closePopup');
        this.themeToggle = document.getElementById('themeToggle');

        this.init();
    }

    init() {
        this.generateTargetPIN();
        this.createKeypad();
        this.startTimer();
        this.setupEventListeners();
        this.initializeTheme();
        feather.replace();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        this.updateThemeIcons(savedTheme);

        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcons(newTheme);
        });
    }

    updateThemeIcons(theme) {
        const lightIcon = document.getElementById('lightIcon');
        const darkIcon = document.getElementById('darkIcon');
        if (theme === 'dark') {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        } else {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        }
    }

    generateTargetPIN() {
        this.targetPIN = Array.from({length: 4}, () => 
            Math.floor(Math.random() * 10)).join('');
        this.targetPinElement.textContent = this.targetPIN;
    }

    createKeypad() {
        const numbers = Array.from({length: 10}, (_, i) => i);
        this.shuffleArray(numbers);

        this.keypadElement.innerHTML = numbers.map(num => `
            <button class="keypad-button" data-number="${num}">${num}</button>
        `).join('');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimerBar();

        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.shuffleTimeout) clearTimeout(this.shuffleTimeout);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerBar();

            if (this.timeLeft <= 0) {
                this.createKeypad();
                this.startTimer();
            }
        }, 1000);
    }

    updateTimerBar() {
        const percentage = (this.timeLeft / 30) * 100;
        this.timerBarElement.style.width = `${percentage}%`;
    }

    setupEventListeners() {
        this.keypadElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('keypad-button')) {
                this.handleNumberInput(e.target.dataset.number);
            }
        });

        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.backspaceBtn.addEventListener('click', () => this.handleBackspace());
        this.shuffleBtn.addEventListener('click', () => this.manualShuffle());
        this.closePopupBtn.addEventListener('click', () => this.hideSuccessPopup());
    }

    manualShuffle() {
        this.createKeypad();
        this.startTimer();
    }

    handleNumberInput(number) {
        if (this.currentInput.length < 4) {
            this.currentInput += number;
            this.updatePinDisplay();

            if (this.currentInput.length === 4) {
                this.verifyPIN();
            }
        }
    }

    handleBackspace() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updatePinDisplay();
        }
    }

    clearInput() {
        this.currentInput = '';
        this.updatePinDisplay();
        this.statusMessageElement.textContent = '';
    }

    updatePinDisplay() {
        this.pinInputElement.textContent = this.currentInput.padEnd(4, '*');
    }

    showSuccessPopup() {
        this.successPin.textContent = this.targetPIN;
        this.successPopup.classList.add('show');
    }

    hideSuccessPopup() {
        this.successPopup.classList.remove('show');
    }

    verifyPIN() {
        this.attempts++;
        this.attemptCountElement.textContent = this.attempts;

        if (this.currentInput === this.targetPIN) {
            this.showStatus('Success! PIN verified correctly', 'success-message');
            this.showSuccessPopup();
            setTimeout(() => {
                this.hideSuccessPopup();
                this.generateTargetPIN();
                this.clearInput();
                this.createKeypad();
                this.startTimer();
                this.attempts = 0;
                this.attemptCountElement.textContent = this.attempts;
            }, 3000);
        } else {
            this.showStatus('Incorrect PIN. Please try again', 'error-message');
            setTimeout(() => {
                this.clearInput();
            }, 1000);
        }
    }

    showStatus(message, className) {
        this.statusMessageElement.textContent = message;
        this.statusMessageElement.className = className;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PINVerification();
});
