// Database integrasjon med CrudCrud

// CrudCrud API-nøkkel
const API_KEY = '40cc769173214f80a53490ac3a6567a8';
const API_URL = `https://crudcrud.com/api/40cc769173214f80a53490ac3a6567a8`;
const USERS_ENDPOINT = `${API_URL}/users`;

/**
 * Lagrer en ny bruker i databasen
 * @param {string} username - Brukernavnet
 * @param {string} password - Passordet (bør krypteres i en ekte app)
 * @returns {Promise} - Promise med resultatet av operasjonen
 */
async function saveUser(username, password) {
    try {
        // Sjekk om brukeren allerede eksisterer
        const existingUser = await getUserByUsername(username);
        
        if (existingUser) {
            showMessage('Brukernavn er allerede i bruk', true);
            return null;
        }
        
        // Lagre bruker
        const userData = {
            username: username,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        const response = await fetch(USERS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Kunne ikke lagre bruker');
        }
        
        const savedUser = await response.json();
        showMessage('Registrering vellykket! Du kan nå logge inn.');
        return savedUser;
    } catch (error) {
        console.error('Feil ved lagring av bruker:', error);
        showMessage('Feil ved registrering. Vennligst prøv igjen senere.', true);
        return null;
    }
}

/**
 * Henter en bruker basert på brukernavn
 * @param {string} username - Brukernavnet å søke etter
 * @returns {Promise} - Promise med brukeren eller null
 */
async function getUserByUsername(username) {
    try {
        const response = await fetch(USERS_ENDPOINT);
        
        if (!response.ok) {
            throw new Error('Kunne ikke hente brukere');
        }
        
        const users = await response.json();
        return users.find(user => user.username === username) || null;
    } catch (error) {
        console.error('Feil ved henting av bruker:', error);
        return null;
    }
}