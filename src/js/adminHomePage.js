import { checkAdminActive, updateActivity } from '/src/js/util.js';
const setPathButton = document.getElementById('setPathButton');
const setInventoryButton = document.getElementById('setInventoryButton');
const viewActionsButton = document.getElementById('viewActionsButton');
const sendRobotTestButton = document.getElementById('sendRobotTestButton');
const robotTestStatus = document.getElementById('robotTestStatus');
const logOutButton = document.getElementById('logOutButton');

if (!localStorage.getItem('adminUsername')) {
    window.location.replace('./adminLogin.html');
}

setInterval(checkAdminActive, 2 * 60 * 1000); // Check every 2 minutes
checkAdminActive(); // Initial check on page load

setPathButton.addEventListener('click', () => {
    window.location.replace("./setPath.html");
    updateActivity();
    console.log('Set Path button clicked');
});

setInventoryButton.addEventListener('click', () => {
    window.location.replace("./setInventory.html");
    updateActivity();
    console.log('Set Inventory button clicked');
});

viewActionsButton.addEventListener('click', () => {
    window.location.replace("./viewActions.html");
    updateActivity();
    console.log('View Actions button clicked');
});

sendRobotTestButton.addEventListener('click', async () => {
    const COMMAND = 'Hello from frontend!';
    sendRobotTestButton.disabled = true;
    if (robotTestStatus) robotTestStatus.textContent = 'Sending…';

    try {
        const response = await fetch('/api/robot-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: COMMAND }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const err = data.error || data.status || response.statusText;
            if (robotTestStatus) {
                robotTestStatus.textContent = `Failed: ${err}`;
            }
            return;
        }

        if (robotTestStatus) {
            robotTestStatus.textContent =
                data.status === 'sent'
                    ? `Sent: "${COMMAND}"`
                    : `Backend: ${data.status || JSON.stringify(data)}`;
        }
    } catch (e) {
        console.error('Robot command error:', e);
        if (robotTestStatus) robotTestStatus.textContent = 'Network error — could not reach server.';
    } finally {
        sendRobotTestButton.disabled = false;
    }
});

logOutButton.addEventListener('click', async() => {
    localStorage.removeItem("adminUsername");
    window.location.replace("./adminLogin.html");
    console.log('Log Out button clicked');
});
