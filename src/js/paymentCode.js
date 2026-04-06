const reportButton = document.getElementById('reportButton');
const homeButton = document.getElementById('homeButton');

homeButton.addEventListener("click", () => {
    window.location.replace("../index.html");
});

reportButton.addEventListener("click", () => {
    window.location.replace("./reportIssue.html");
});

/**
 * Forwards to the robot over TCP via /api/robot-command (length-prefixed UTF-8 on the wire).
 * Robot parses JSON: type, email, code.
 */
async function sendCodeToRobot(email, code) {
    const command = JSON.stringify({
        type: "customer_queue",
        email: email || "",
        code: String(code),
    });

    try {
        const response = await fetch("/api/robot-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command }),
        });
        const data = await response.json().catch(() => ({}));
        return response.ok && data.status === "sent";
    } catch (e) {
        console.error("Robot notify failed:", e);
        return false;
    }
}

async function loadCode() {

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    const response = await fetch(`/api/get-code?session_id=${sessionId}`);
    const data = await response.json();

    if (data.code) {
        document.getElementById("codeDisplay").innerText = data.code;
    } else {
        document.getElementById("codeDisplay").innerText = "Code unavailable";
    }

    if (data.email) {
        const emailEl = document.getElementById("emailDisplay");
        if (emailEl) {
            emailEl.textContent = `Checkout email: ${data.email}`;
            emailEl.classList.remove("hidden");
        }
    }

    if (data.code) {
        const notifiedKey = `vm_robot_notified_${sessionId}`;
        if (!sessionStorage.getItem(notifiedKey)) {
            const ok = await sendCodeToRobot(data.email || "", data.code);
            if (ok) {
                sessionStorage.setItem(notifiedKey, "1");
            }
        }
    }
}

loadCode();