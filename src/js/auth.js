// Autentiseringsfunksjoner for applikasjonen

/**
 * Viser en melding til brukeren
 * @param {string} message - Meldingen som skal vises
 * @param {boolean} isError - Om meldingen er en feilmelding
 */
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error' : 'success';
}

/**
 * Validerer et brukernavn
 * @param {string} username - Brukernavnet som skal valideres
 * @returns {boolean} - Om brukernavnet er gyldig
 */
function validateUsername(username) {
    // Brukernavn må være minst 3 tegn
    return username && username.length >= 3;
}

/**
 * Validerer et passord
 * @param {string} password - Passordet som skal valideres
 * @returns {boolean} - Om passordet er gyldig
 */
function validatePassword(password) {
    // Passord må være minst 6 tegn
    return password && password.length >= 6;
}

/**
 * Håndterer registrering av en ny bruker
 * @param {Event} event - Skjemahendelsen
 */
function handleRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Validere input
    if (!validateUsername(username)) {
        showMessage('Brukernavn må være minst 3 tegn', true);
        return;
    }
    
    if (!validatePassword(password)) {
        showMessage('Passord må være minst 6 tegn', true);
        return;
    }
    
    // Lagre bruker i databasen
    saveUser(username, password);
}

/**
 * Håndterer innlogging av en bruker
 * @param {Event} event - Skjemahendelsen
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validere input
    if (!validateUsername(username)) {
        showMessage('Brukernavn må være minst 3 tegn', true);
        return;
    }
    
    if (!validatePassword(password)) {
        showMessage('Passord må være minst 6 tegn', true);
        return;
    }
    
    // Autentisere bruker
    authenticateUser(username, password);
}

// Legge til event listeners når DOM er lastet
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});