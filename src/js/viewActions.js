const actionsTextArea = document.getElementById('actions');
const homebutton = document.getElementById('homeButton');

if (!localStorage.getItem('adminUsername')) {
    window.location.replace('./adminLogin.html');
}

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

homebutton.addEventListener('click', () => {
    window.location.replace("./adminDashboard.html");
});

async function fetchActions() {
    try {
        const response = await fetch('/api/get-actions');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const header = 'Action Time | Username | Action Type';
        const formatted = data.map(a =>
            `${a.action_time} | ${a.username} | ${a.type_name}`
        );

        actionsTextArea.value = header + '\n\n' + formatted.join('\n\n');
    } catch (error) {
        console.error('Error fetching actions:', error);
        actionsTextArea.value = 'Failed to load actions.';
    }
}

fetchActions();