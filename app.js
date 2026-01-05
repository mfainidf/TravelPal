// TravelPal App - Main JavaScript

class TravelPal {
    constructor() {
        this.locations = this.loadLocations();
        this.apiKey = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderLocations();
    }

    setupEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Add location
        document.getElementById('add-location-btn').addEventListener('click', () => this.addLocation());
        document.getElementById('location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addLocation();
        });

        // AI Suggestions
        document.getElementById('get-suggestions-btn').addEventListener('click', () => this.getSuggestions());
        document.getElementById('destination-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.getSuggestions();
        });

        // API Key Modal
        document.getElementById('save-api-key-btn').addEventListener('click', () => this.saveApiKey());
        document.getElementById('cancel-api-key-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('api-key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });
    }

    switchTab(button) {
        const tabName = button.dataset.tab;
        
        // Update button states
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    loadLocations() {
        const stored = localStorage.getItem('travelpal-locations');
        return stored ? JSON.parse(stored) : [];
    }

    saveLocations() {
        localStorage.setItem('travelpal-locations', JSON.stringify(this.locations));
    }

    addLocation(locationName = null) {
        const input = document.getElementById('location-input');
        const name = locationName || input.value.trim();
        
        if (!name) {
            this.showError('Please enter a location name.');
            return;
        }

        if (this.locations.some(loc => loc.name.toLowerCase() === name.toLowerCase())) {
            this.showError('This location is already in your list.');
            return;
        }

        this.locations.push({
            id: Date.now(),
            name: name,
            addedAt: new Date().toISOString()
        });

        this.saveLocations();
        this.renderLocations();
        input.value = '';
        
        this.showSuccess(`Added "${name}" to your locations!`);
    }

    removeLocation(id) {
        this.locations = this.locations.filter(loc => loc.id !== id);
        this.saveLocations();
        this.renderLocations();
    }

    renderLocations() {
        const list = document.getElementById('locations-list');
        
        if (this.locations.length === 0) {
            list.innerHTML = '<li style="padding: 20px; text-align: center; color: #999;">No locations yet. Add your first location above!</li>';
            return;
        }

        list.innerHTML = this.locations.map(location => `
            <li class="location-item">
                <span>${location.name}</span>
                <button onclick="app.removeLocation(${location.id})">Remove</button>
            </li>
        `).join('');
    }

    async getSuggestions() {
        const input = document.getElementById('destination-input');
        const destination = input.value.trim();

        if (!destination) {
            this.showError('Please enter a destination or interest.');
            return;
        }

        // Check if API key exists in sessionStorage
        this.apiKey = sessionStorage.getItem('gemini-api-key');

        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }

        await this.fetchSuggestions(destination);
    }

    showApiKeyModal() {
        const modal = document.getElementById('api-key-modal');
        modal.classList.remove('hidden');
        document.getElementById('api-key-input').focus();
    }

    closeModal() {
        const modal = document.getElementById('api-key-modal');
        modal.classList.add('hidden');
        document.getElementById('api-key-input').value = '';
    }

    saveApiKey() {
        const input = document.getElementById('api-key-input');
        const apiKey = input.value.trim();

        if (!apiKey) {
            alert('Please enter a valid API key.');
            return;
        }

        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('gemini-api-key', apiKey);
        this.apiKey = apiKey;
        
        this.closeModal();
        this.getSuggestions();
    }

    async fetchSuggestions(destination) {
        const container = document.getElementById('suggestions-container');
        const loadingIndicator = document.getElementById('loading-indicator');

        // Clear previous results
        container.innerHTML = '';
        loadingIndicator.classList.remove('hidden');

        try {
            const prompt = `Suggest five unique and interesting places to visit in ${destination}, covering a variety of types (nature, museums, food, activities, hidden gems). For each place, provide:
1. A clear name/title
2. A brief description (2-3 sentences)

Format your response as a numbered list with each entry on a new line.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 400 && errorData.error?.message?.includes('API_KEY_INVALID')) {
                    sessionStorage.removeItem('gemini-api-key');
                    this.apiKey = null;
                    throw new Error('Invalid API key. Please enter a valid Google Gemini API key.');
                }
                
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No suggestions received from the API.');
            }

            const text = data.candidates[0].content.parts[0].text;
            this.displaySuggestions(text, destination);

        } catch (error) {
            console.error('Error fetching suggestions:', error);
            container.innerHTML = `
                <div class="error-message">
                    <strong>Error:</strong> ${error.message}
                    <br><br>
                    Please check your API key and try again.
                </div>
            `;
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    displaySuggestions(text, destination) {
        const container = document.getElementById('suggestions-container');
        
        // Parse the suggestions text
        const suggestions = this.parseSuggestions(text);
        
        if (suggestions.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    Could not parse suggestions. Here's the raw response:
                    <pre style="margin-top: 10px; white-space: pre-wrap;">${text}</pre>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h3 style="color: #667eea; margin-bottom: 20px;">AI Suggestions for "${destination}"</h3>
            ${suggestions.map(suggestion => `
                <div class="suggestion-card">
                    <h4>${suggestion.title}</h4>
                    <p>${suggestion.description}</p>
                    <button onclick="app.addLocation('${this.escapeHtml(suggestion.title)}')">
                        Add to My Locations
                    </button>
                </div>
            `).join('')}
        `;
    }

    parseSuggestions(text) {
        const suggestions = [];
        
        // Try to parse numbered list format
        const lines = text.split('\n').filter(line => line.trim());
        let currentSuggestion = null;

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Check if it's a numbered item (e.g., "1.", "1)", "1 -", etc.)
            const numberMatch = trimmed.match(/^(\d+)[.\)\-:]\s*(.+)/);
            
            if (numberMatch) {
                // Save previous suggestion if exists
                if (currentSuggestion) {
                    suggestions.push(currentSuggestion);
                }
                
                // Start new suggestion
                const titleAndDesc = numberMatch[2];
                
                // Try to split title and description by common separators
                const separatorMatch = titleAndDesc.match(/^([^:\-–—]+)[\-–—:]\s*(.+)/);
                
                if (separatorMatch) {
                    currentSuggestion = {
                        title: separatorMatch[1].trim(),
                        description: separatorMatch[2].trim()
                    };
                } else {
                    currentSuggestion = {
                        title: titleAndDesc.trim(),
                        description: ''
                    };
                }
            } else if (currentSuggestion && trimmed && !trimmed.match(/^[\*\-]/)) {
                // Add to current suggestion's description
                currentSuggestion.description += (currentSuggestion.description ? ' ' : '') + trimmed;
            }
        }

        // Don't forget the last suggestion
        if (currentSuggestion) {
            suggestions.push(currentSuggestion);
        }

        // If parsing failed, try alternative parsing with asterisks or dashes
        if (suggestions.length === 0) {
            const bulletMatches = text.match(/[\*\-]\s*\*?\*?([^:\n]+)[\-–—:]?\s*([^\n]+)/g);
            if (bulletMatches) {
                bulletMatches.forEach(match => {
                    const cleaned = match.replace(/^[\*\-]\s*\*?\*?/, '').trim();
                    const parts = cleaned.split(/[\-–—:]/);
                    if (parts.length >= 2) {
                        suggestions.push({
                            title: parts[0].trim(),
                            description: parts.slice(1).join(' ').trim()
                        });
                    }
                });
            }
        }

        return suggestions;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/'/g, '&#39;');
    }

    showError(message) {
        const container = document.getElementById('suggestions-container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.innerHTML = '';
        container.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const container = document.getElementById('suggestions-container');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        container.innerHTML = '';
        container.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TravelPal();
});
