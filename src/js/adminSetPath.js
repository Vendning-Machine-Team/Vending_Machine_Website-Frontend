import { checkAdminActive, updateActivity } from '/src/js/util.js';
const homeButton = document.getElementById('homeButton');
const confirmButton = document.getElementById('confirmButton');

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