// Main Application Logic for Math Practice PWA

class MathPracticeApp {
    constructor() {
        this.selectedDifficulty = 'easy';
        this.selectedConcept = 'numbers';
        this.difficultySettings = {
            easy: { min: 1, max: 10, label: 'Easy (1-10)' },
            medium: { min: 1, max: 99, label: 'Medium (1-99)' },
            hard: { min: 0, max: 999, label: 'Hard (0-999)' }
        };
        this.init();
        this.registerServiceWorker();
        this.setupPWAInstall();
    }

    init() {
        this.setupEventListeners();
        this.selectDefaultOptions();
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectDifficulty(card.dataset.level);
            });
        });

        // Concept selection
        document.querySelectorAll('.concept-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectConcept(card.dataset.concept);
            });
        });

        // Action buttons
        const startBtn = document.getElementById('startInteractiveBtn');
        const pdfBtn = document.getElementById('generatePdfBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startInteractivePractice();
            });
        }

        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => {
                this.generatePdfWorksheet();
            });
        }

        // Modal controls
        const closeBtn = document.getElementById('closeModal');
        const modal = document.getElementById('practiceModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'practiceModal') {
                    this.closeModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    selectDefaultOptions() {
        // Select easy difficulty by default
        this.selectDifficulty('easy');
        // Select numbers concept by default
        this.selectConcept('numbers');
    }

    selectDifficulty(level) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected', 'easy', 'medium', 'hard');
        });

        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-level="${level}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected', level);
        }
        
        this.selectedDifficulty = level;
        this.updateActionButtons();
    }

    selectConcept(concept) {
        // Remove previous selection
        document.querySelectorAll('.concept-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-concept="${concept}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedConcept = concept;
        this.updateActionButtons();
    }

    updateActionButtons() {
        const settings = this.difficultySettings[this.selectedDifficulty];
        const conceptCard = document.querySelector(`[data-concept="${this.selectedConcept}"] h4`);
        const conceptName = conceptCard ? conceptCard.textContent : this.selectedConcept;
        
        // Update button text with current selection
        const interactiveBtn = document.getElementById('startInteractiveBtn');
        const pdfBtn = document.getElementById('generatePdfBtn');
        
        if (interactiveBtn) {
            interactiveBtn.innerHTML = `<i class="fas fa-play mr-2"></i>Start ${settings.label} - ${conceptName}`;
        }
        
        if (pdfBtn) {
            pdfBtn.innerHTML = `<i class="fas fa-file-pdf mr-2"></i>Generate ${settings.label} PDF`;
        }
    }

    startInteractivePractice() {
        console.log('Starting interactive practice...', this.selectedDifficulty, this.selectedConcept);
        
        const modal = document.getElementById('practiceModal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Initialize interactive practice
            if (window.interactivePractice) {
                window.interactivePractice.start(this.selectedDifficulty, this.selectedConcept);
            } else {
                console.error('Interactive practice module not loaded');
                // Fallback - show basic content
                const content = document.getElementById('practiceContent');
                if (content) {
                    content.innerHTML = `
                        <div class="text-center">
                            <h3 class="text-2xl font-bold mb-4">Loading Practice Session...</h3>
                            <p class="text-lg">Difficulty: ${this.selectedDifficulty}</p>
                            <p class="text-lg">Concept: ${this.selectedConcept}</p>
                        </div>
                    `;
                }
            }
        }
    }

    generatePdfWorksheet() {
        console.log('Generating PDF worksheet...', this.selectedDifficulty, this.selectedConcept);
        
        // Show loading state
        const btn = document.getElementById('generatePdfBtn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
            btn.disabled = true;

            // Generate worksheet
            setTimeout(() => {
                if (window.worksheetGenerator) {
                    window.worksheetGenerator.generate(this.selectedDifficulty, this.selectedConcept);
                } else {
                    console.error('Worksheet generator module not loaded');
                    // Fallback - show basic worksheet
                    this.showBasicWorksheet();
                }
                
                // Reset button
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        }
    }

    showBasicWorksheet() {
        const container = document.getElementById('worksheetContainer');
        if (container) {
            container.innerHTML = `
                <div class="page p-8 text-center">
                    <h1 class="text-4xl font-bold text-blue-900 mb-8">Math Practice Worksheet</h1>
                    <div class="text-2xl mb-4">Difficulty: ${this.selectedDifficulty}</div>
                    <div class="text-2xl mb-8">Concept: ${this.selectedConcept}</div>
                    <p class="text-lg">Worksheet generator is loading...</p>
                    <button onclick="window.print()" class="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg">
                        Print This Page
                    </button>
                </div>
            `;
            container.classList.remove('hidden');
        }
    }

    closeModal() {
        const modal = document.getElementById('practiceModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Stop interactive practice if running
        if (window.interactivePractice) {
            window.interactivePractice.stop();
        }
    }

    // PWA Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    // PWA Install Prompt
    setupPWAInstall() {
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.classList.remove('hidden');
            }
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response to the install prompt: ${outcome}`);
                    deferredPrompt = null;
                    installBtn.classList.add('hidden');
                }
            });
        }

        window.addEventListener('appinstalled', (evt) => {
            console.log('App was installed');
            if (installBtn) {
                installBtn.classList.add('hidden');
            }
        });
    }
}

// Utility functions
const MathUtils = {
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    generateNumberLine(start, end, currentPos = null, operation = null) {
        const range = end - start;
        const width = Math.min(800, range * 50);
        const scale = width / range;
        
        let svg = `<svg width="${width}" height="120" viewBox="0 0 ${width} 120" class="number-line">`;
        
        // Main line
        svg += `<line x1="0" y1="60" x2="${width}" y2="60" stroke="#374151" stroke-width="3"/>`;
        
        // Tick marks and numbers
        for (let i = start; i <= end; i++) {
            const x = (i - start) * scale;
            svg += `<line x1="${x}" y1="50" x2="${x}" y2="70" stroke="#374151" stroke-width="2"/>`;
            svg += `<text x="${x}" y="90" text-anchor="middle" font-size="14" font-weight="600" fill="#374151">${i}</text>`;
            
            // Highlight current position
            if (currentPos === i) {
                svg += `<circle cx="${x}" cy="60" r="8" fill="#ef4444" stroke="#fff" stroke-width="2"/>`;
            }
        }
        
        svg += '</svg>';
        return svg;
    },

    createShape(shapeName, size = 100) {
        const shapes = {
            triangle: `<polygon points="${size/2},10 10,${size-10} ${size-10},${size-10}" fill="none" stroke="#3b82f6" stroke-width="3"/>`,
            square: `<rect x="10" y="10" width="${size-20}" height="${size-20}" fill="none" stroke="#3b82f6" stroke-width="3"/>`,
            circle: `<circle cx="${size/2}" cy="${size/2}" r="${(size-20)/2}" fill="none" stroke="#3b82f6" stroke-width="3"/>`,
            rectangle: `<rect x="10" y="20" width="${size-20}" height="${size-40}" fill="none" stroke="#3b82f6" stroke-width="3"/>`,
            pentagon: `<polygon points="${size/2},10 ${size-10},${size/3} ${size*0.75},${size-10} ${size*0.25},${size-10} 10,${size/3}" fill="none" stroke="#3b82f6" stroke-width="3"/>`,
            hexagon: `<polygon points="${size/2},10 ${size-10},${size/4} ${size-10},${size*0.75} ${size/2},${size-10} 10,${size*0.75} 10,${size/4}" fill="none" stroke="#3b82f6" stroke-width="3"/>`
        };
        
        return `<svg width="${size}" height="${size}" class="shape-svg">${shapes[shapeName] || shapes.square}</svg>`;
    }
};

// Test function to verify functionality
function testApp() {
    console.log('Testing app functionality...');
    console.log('MathUtils available:', typeof MathUtils);
    console.log('Random number test:', MathUtils.getRandomInt(1, 10));
    console.log('App instance:', window.mathApp);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        window.mathApp = new MathPracticeApp();
        console.log('Math app initialized successfully');
        
        // Test functionality
        window.testApp = testApp;
        testApp();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});