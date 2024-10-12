let startTracking = false;
let watchId;
let previousPosition = null;
let totalDistance = 0;
let totalCalories = 0;

const distanceElem = document.getElementById('distance');
const caloriesElem = document.getElementById('calories');
const statusElem = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

// Function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Function to calculate calories based on distance covered
function calculateCalories(distance) {
    const avgCaloriesPerKm = 60; // Rough estimate for walking calories burned per km
    return distance * avgCaloriesPerKm;
}

// Function to update the distance and calories burned
function updateStats(position) {
    const { latitude, longitude } = position.coords;

    if (previousPosition) {
        const { latitude: prevLat, longitude: prevLon } = previousPosition.coords;
        const distance = calculateDistance(prevLat, prevLon, latitude, longitude);

        if (distance > 0.01) { // Ignore small movements (under 10 meters)
            totalDistance += distance;
            totalCalories += calculateCalories(distance);
        }
    }

    previousPosition = position;

    distanceElem.textContent = totalDistance.toFixed(2) + ' km';
    caloriesElem.textContent = Math.round(totalCalories) + ' cal';
}

function handleError(error) {
    statusElem.textContent = `Error: ${error.message}`;
}

// Start tracking location
startBtn.addEventListener('click', () => {
    startTracking = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    statusElem.textContent = 'Tracking your location...';

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updateStats, handleError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
        });
    } else {
        statusElem.textContent = 'Geolocation is not supported by this browser.';
    }
});

// Stop tracking location
stopBtn.addEventListener('click', () => {
    if (startTracking && watchId) {
        navigator.geolocation.clearWatch(watchId);
        startTracking = false;
        statusElem.textContent = 'Tracking stopped.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
});
