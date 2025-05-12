// Autentiseringsfunksjoner

/**
 * Autentiserer en bruker
 * @param {string} username - Brukernavnet
 * @param {string} password - Passordet
 * @returns {Promise<boolean>} - Om autentiseringen var vellykket
 */
async function authenticateUser(username, password) {
    try {
        const user = await getUserByUsername(username);
        
        if (!user) {
            showMessage('Brukernavn eller passord er feil', true);
            return false;
        }
        
        // Sjekk passord
        if (user.password !== password) {
            showMessage('Brukernavn eller passord er feil', true);
            return false;
        }
        
        // Lagre brukerøkt
        createSession(user);
        
        showMessage('Innlogging vellykket!');
        
        // Omdirigere til app-siden
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('Autentiseringsfeil:', error);
        showMessage('Feil ved innlogging. Vennligst prøv igjen senere.', true);
        return false;
    }
}

/**
 * Oppretter en brukerøkt
 * @param {Object} user - Brukerinformasjon
 */
function createSession(user) {
    // Fjern passordet fra brukerinformasjonen før lagring
    const sessionUser = {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt
    };
    
    // Lagre brukerinformasjon i localStorage
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    localStorage.setItem('isLoggedIn', 'true');
}

/**
 * Sjekker om en bruker er innlogget
 * @returns {boolean} - Om brukeren er innlogget
 */
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Henter den innloggede brukeren
 * @returns {Object|null} - Brukerinformasjon eller null
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Logger ut den nåværende brukeren
 */
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Sjekk om brukeren er innlogget på sider som krever autentisering
document.addEventListener('DOMContentLoaded', () => {
    // Sjekk om vi er på app.html (eller andre beskyttede sider)
    if (window.location.pathname.includes('app.html') && !isLoggedIn()) {
        // Omdirigere til innloggingssiden
        window.location.href = 'index.html';
    }
});