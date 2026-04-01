export async function updateActivity(){
    const response = await fetch('/api/update-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: localStorage.getItem('adminUsername') }),
    });
    if (!response.ok) {
        console.error('Failed to update activity:', response.statusText);
    }
}
export function forceLogout() {
    localStorage.removeItem('adminUsername');

    // replace prevents going "back" into dashboard
    window.location.replace('./adminLogin.html');
}

export async function checkAdminActive() {
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