const homeButton = document.getElementById('homeButton');
const confirmButton = document.getElementById('confirmButton');

async function updateActivity(){
    const response = await fetch('/api/update-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: localStorage.getItem('adminUsername') }),
    });
    if (!response.ok) {
        console.error('Failed to update activity:', response.statusText);
    }
}

function forceLogout() {
    localStorage.removeItem('adminUsername');

    // replace prevents going "back" into dashboard
    window.location.replace('./adminLogin.html');
}

async function checkAdminActive() {
    const username = localStorage.getItem('adminUsername');

    const response = await fetch(`/api/is-admin-active?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
        forceLogout();
        return;
    }
    const data = await response.json();
    if (!data.active) {
        forceLogout();
    }
}

setInterval(checkAdminActive, 2 * 60 * 1000); // Check every 2 minutes
checkAdminActive(); // Initial check on page load

if (!localStorage.getItem('adminUsername')) {
    window.location.replace('./adminLogin.html');
}

homeButton.addEventListener('click', () => {
    window.location.replace("./adminDashboard.html");
    updateActivity();
    console.log('Home button clicked');
});

confirmButton.addEventListener('click', () => {
    alert("Successfully updated path bounds")
    updateActivity();
    console.log('Confirm button clicked');
});