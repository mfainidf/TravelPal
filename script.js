// Tab Navigation
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Journey Planning Functions
function saveJourney() {
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const budget = document.getElementById('budget').value;
    const notes = document.getElementById('notes').value;

    if (!destination || !startDate || !endDate) {
        alert('Please fill in destination and dates!');
        return;
    }

    const journey = {
        destination,
        startDate,
        endDate,
        budget,
        notes
    };

    localStorage.setItem('travelpal-journey', JSON.stringify(journey));
    displayJourney();
    alert('Journey plan saved successfully!');
}

function displayJourney() {
    const journeyData = localStorage.getItem('travelpal-journey');
    if (!journeyData) return;

    const journey = JSON.parse(journeyData);
    const display = document.getElementById('journey-display');
    const info = document.getElementById('journey-info');

    // Calculate duration
    const start = new Date(journey.startDate);
    const end = new Date(journey.endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    info.innerHTML = `
        <div class="info-row">
            <div class="info-label">Destination:</div>
            <div class="info-value">${journey.destination}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Start Date:</div>
            <div class="info-value">${formatDate(journey.startDate)}</div>
        </div>
        <div class="info-row">
            <div class="info-label">End Date:</div>
            <div class="info-value">${formatDate(journey.endDate)}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Duration:</div>
            <div class="info-value">${duration} days</div>
        </div>
        ${journey.budget ? `
        <div class="info-row">
            <div class="info-label">Budget:</div>
            <div class="info-value">$${journey.budget}</div>
        </div>
        ` : ''}
        ${journey.notes ? `
        <div class="info-row">
            <div class="info-label">Notes:</div>
            <div class="info-value">${journey.notes}</div>
        </div>
        ` : ''}
    `;

    display.style.display = 'block';
}

function editJourney() {
    const journeyData = localStorage.getItem('travelpal-journey');
    if (!journeyData) return;

    const journey = JSON.parse(journeyData);
    document.getElementById('destination').value = journey.destination;
    document.getElementById('start-date').value = journey.startDate;
    document.getElementById('end-date').value = journey.endDate;
    document.getElementById('budget').value = journey.budget || '';
    document.getElementById('notes').value = journey.notes || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Travel Preparation Functions
function savePreparationState() {
    const checkboxes = document.querySelectorAll('#preparation-tab input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach(checkbox => {
        state[checkbox.id] = checkbox.checked;
        // Update visual state
        const item = checkbox.closest('.checklist-item');
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    });
    
    localStorage.setItem('travelpal-preparation', JSON.stringify(state));
}

function loadPreparationState() {
    const stateData = localStorage.getItem('travelpal-preparation');
    if (!stateData) return;

    const state = JSON.parse(stateData);
    Object.keys(state).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = state[id];
            const item = checkbox.closest('.checklist-item');
            if (state[id]) {
                item.classList.add('checked');
            }
        }
    });
}

function addCustomPreparation() {
    const input = document.getElementById('custom-prep-input');
    const text = input.value.trim();
    
    if (!text) return;

    const customItems = getCustomPreparation();
    const id = `custom-prep-${Date.now()}`;
    customItems.push({ id, text, checked: false });
    
    localStorage.setItem('travelpal-custom-preparation', JSON.stringify(customItems));
    input.value = '';
    renderCustomPreparation();
}

function getCustomPreparation() {
    const data = localStorage.getItem('travelpal-custom-preparation');
    return data ? JSON.parse(data) : [];
}

function renderCustomPreparation() {
    const list = document.getElementById('custom-prep-list');
    const items = getCustomPreparation();
    
    if (items.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No custom items yet</p></div>';
        return;
    }

    list.innerHTML = items.map(item => `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
            <input type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''} 
                   onchange="toggleCustomPreparation('${item.id}')">
            <label for="${item.id}">${item.text}</label>
            <button class="btn btn-danger" onclick="deleteCustomPreparation('${item.id}')">Delete</button>
        </div>
    `).join('');
}

function toggleCustomPreparation(id) {
    const items = getCustomPreparation();
    const item = items.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        localStorage.setItem('travelpal-custom-preparation', JSON.stringify(items));
        renderCustomPreparation();
    }
}

function deleteCustomPreparation(id) {
    const items = getCustomPreparation();
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem('travelpal-custom-preparation', JSON.stringify(filtered));
    renderCustomPreparation();
}

// Baggage Checklist Functions
function saveBaggageState() {
    const checkboxes = document.querySelectorAll('#baggage-tab input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach(checkbox => {
        state[checkbox.id] = checkbox.checked;
        // Update visual state
        const item = checkbox.closest('.checklist-item');
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    });
    
    localStorage.setItem('travelpal-baggage', JSON.stringify(state));
}

function loadBaggageState() {
    const stateData = localStorage.getItem('travelpal-baggage');
    if (!stateData) return;

    const state = JSON.parse(stateData);
    Object.keys(state).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = state[id];
            const item = checkbox.closest('.checklist-item');
            if (state[id]) {
                item.classList.add('checked');
            }
        }
    });
}

function addCustomBaggage() {
    const input = document.getElementById('custom-bag-input');
    const text = input.value.trim();
    
    if (!text) return;

    const customItems = getCustomBaggage();
    const id = `custom-bag-${Date.now()}`;
    customItems.push({ id, text, checked: false });
    
    localStorage.setItem('travelpal-custom-baggage', JSON.stringify(customItems));
    input.value = '';
    renderCustomBaggage();
}

function getCustomBaggage() {
    const data = localStorage.getItem('travelpal-custom-baggage');
    return data ? JSON.parse(data) : [];
}

function renderCustomBaggage() {
    const list = document.getElementById('custom-bag-list');
    const items = getCustomBaggage();
    
    if (items.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No custom items yet</p></div>';
        return;
    }

    list.innerHTML = items.map(item => `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
            <input type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''} 
                   onchange="toggleCustomBaggage('${item.id}')">
            <label for="${item.id}">${item.text}</label>
            <button class="btn btn-danger" onclick="deleteCustomBaggage('${item.id}')">Delete</button>
        </div>
    `).join('');
}

function toggleCustomBaggage(id) {
    const items = getCustomBaggage();
    const item = items.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        localStorage.setItem('travelpal-custom-baggage', JSON.stringify(items));
        renderCustomBaggage();
    }
}

function deleteCustomBaggage(id) {
    const items = getCustomBaggage();
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem('travelpal-custom-baggage', JSON.stringify(filtered));
    renderCustomBaggage();
}

// Location Functions
function addLocation() {
    const name = document.getElementById('location-name').value.trim();
    const category = document.getElementById('location-category').value;
    const rating = document.getElementById('location-rating').value;
    const notes = document.getElementById('location-notes').value.trim();

    if (!name) {
        alert('Please enter a location name!');
        return;
    }

    const locations = getLocations();
    const id = `location-${Date.now()}`;
    
    locations.push({
        id,
        name,
        category,
        rating: parseInt(rating),
        notes
    });

    localStorage.setItem('travelpal-locations', JSON.stringify(locations));
    
    // Clear form
    document.getElementById('location-name').value = '';
    document.getElementById('location-category').value = 'attraction';
    document.getElementById('location-rating').value = '5';
    document.getElementById('location-notes').value = '';
    
    renderLocations();
    alert('Location added successfully!');
}

function getLocations() {
    const data = localStorage.getItem('travelpal-locations');
    return data ? JSON.parse(data) : [];
}

let currentFilter = 'all';

function filterLocations(category) {
    currentFilter = category;
    
    // Update button states
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if ((category === 'all' && btn.textContent === 'All') ||
            btn.textContent.toLowerCase().includes(category)) {
            btn.classList.add('active');
        }
    });
    
    renderLocations();
}

function renderLocations() {
    const list = document.getElementById('locations-list');
    const locations = getLocations();
    
    const filtered = currentFilter === 'all' 
        ? locations 
        : locations.filter(loc => loc.category === currentFilter);

    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No locations found</p></div>';
        return;
    }

    list.innerHTML = filtered.map(location => `
        <div class="location-item">
            <div class="location-header">
                <div class="location-title">${location.name}</div>
                <span class="location-category">${getCategoryLabel(location.category)}</span>
            </div>
            <div class="location-rating">${getStars(location.rating)}</div>
            ${location.notes ? `<div class="location-notes">${location.notes}</div>` : ''}
            <div class="location-actions">
                <button class="btn btn-danger" onclick="deleteLocation('${location.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteLocation(id) {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    const locations = getLocations();
    const filtered = locations.filter(loc => loc.id !== id);
    localStorage.setItem('travelpal-locations', JSON.stringify(filtered));
    renderLocations();
}

function getCategoryLabel(category) {
    const labels = {
        'attraction': 'Tourist Attraction',
        'restaurant': 'Restaurant',
        'hotel': 'Hotel',
        'activity': 'Activity',
        'shopping': 'Shopping',
        'other': 'Other'
    };
    return labels[category] || category;
}

function getStars(rating) {
    return '⭐'.repeat(rating);
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    displayJourney();
    loadPreparationState();
    loadBaggageState();
    renderCustomPreparation();
    renderCustomBaggage();
    renderLocations();
});
