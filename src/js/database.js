// Database integrasjon med CrudCrud

// CrudCrud API-nøkkel
const API_KEY = '1c7a08218e96445dbeaf766d825d1f20'; // Oppdatert nøkkel (13.05.2024)
const API_URL = `https://crudcrud.com/api/1c7a08218e96445dbeaf766d825d1f20`;
const USERS_ENDPOINT = `${API_URL}/users`;
const FILTERS_ENDPOINT = `${API_URL}/filters`;

/**
 * Lagrer en ny bruker i databasen
 * @param {string} username - Brukernavnet
 * @param {string} password - Passordet
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
        // Simuler en API-forespørsel med localStorage
        const usersJson = localStorage.getItem('datingAppUsers');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Finn brukeren
        const user = users.find(user => user.username === username);
        return user || null;
    } catch (error) {
        console.error('Feil ved henting av bruker:', error);
        return null;
    }
}

/**
 * Lagrer en ny bruker i databasen
 * @param {string} username - Brukernavnet
 * @param {string} password - Passordet
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

        // Hent eksisterende brukere
        const usersJson = localStorage.getItem('datingAppUsers');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Opprett ny bruker
        const newUser = {
            id: Date.now().toString(),
            username: username,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Legg til ny bruker
        users.push(newUser);

        // Lagre oppdatert brukerliste
        localStorage.setItem('datingAppUsers', JSON.stringify(users));

        showMessage('Registrering vellykket! Du kan nå logge inn.');
        return newUser;
    } catch (error) {
        console.error('Feil ved lagring av bruker:', error);
        showMessage('Feil ved registrering. Vennligst prøv igjen senere.', true);
        return null;
    }
}

/**
 * Lagrer brukerens filterpreferanser i databasen
 * @param {string} _ - Brukerens ID (ikke brukt i denne implementasjonen)
 * @param {Object} filters - Filterobjekt som skal lagres
 * @returns {Promise} - Promise med resultatet av operasjonen
 */
async function saveFiltersToDatabase(_, filters) {
    try {
        // Sjekk om API-nøkkelen er utløpt eller CORS-problemer
        try {
            // Test API-tilgjengelighet
            const testResponse = await fetch(API_URL, {
                method: 'GET',
                mode: 'cors'
            });

            if (!testResponse.ok) {
                throw new Error('API ikke tilgjengelig');
            }
        } catch (corsError) {
            console.warn('CORS-problem eller API-nøkkel utløpt:', corsError);
            throw new Error('CORS-problem eller API-nøkkel utløpt');
        }

        // Generer en unik nøkkel for å identifisere brukerens filtre
        const username = localStorage.getItem('currentUser') ?
            JSON.parse(localStorage.getItem('currentUser')).username :
            'anonymous';

        // Opprett nye filtre - alltid opprett nye i stedet for å oppdatere
        // Dette unngår problemer med ID-formatet i CrudCrud
        const filterData = {
            username,
            minAge: filters.minAge,
            maxAge: filters.maxAge,
            gender: filters.gender,
            timestamp: new Date().toISOString()
        };

        console.log('Lagrer følgende filterdata til CrudCrud:', filterData);

        const createResponse = await fetch(FILTERS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        });

        if (!createResponse.ok) {
            throw new Error('Kunne ikke opprette filtre');
        }

        return await createResponse.json();
    } catch (error) {
        console.error('Feil ved lagring av filtre i database:', error);
        throw error;
    }
}

/**
 * Henter brukerens filterpreferanser fra databasen
 * @param {string} _ - Brukerens ID (ikke brukt i denne implementasjonen)
 * @returns {Promise} - Promise med filterobjekt eller null
 */
async function getFiltersFromDatabase(_) {
    try {
        // Sjekk om API-nøkkelen er utløpt eller CORS-problemer
        try {
            // Test API-tilgjengelighet
            const testResponse = await fetch(API_URL, {
                method: 'GET',
                mode: 'cors'
            });

            if (!testResponse.ok) {
                throw new Error('API ikke tilgjengelig');
            }
        } catch (corsError) {
            console.warn('CORS-problem eller API-nøkkel utløpt:', corsError);
            throw new Error('CORS-problem eller API-nøkkel utløpt');
        }

        // Hent brukernavn fra localStorage
        const username = localStorage.getItem('currentUser') ?
            JSON.parse(localStorage.getItem('currentUser')).username :
            'anonymous';

        // Hent alle filtre og filtrer etter brukernavn
        const response = await fetch(FILTERS_ENDPOINT);

        if (!response.ok) {
            throw new Error('Kunne ikke hente filtre');
        }

        const allFilters = await response.json();
        console.log('Alle filtre hentet fra CrudCrud:', allFilters);

        // Filtrer etter brukernavn og sorter etter tidsstempel (nyeste først)
        const userFilters = allFilters
            .filter(filter => filter.username === username)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('Filtrerte filtre for bruker', username, ':', userFilters);

        if (userFilters && userFilters.length > 0) {
            // Returner det nyeste filteret
            return userFilters[0];
        }

        return null;
    } catch (error) {
        console.error('Feil ved henting av filtre fra database:', error);
        throw error;
    }
}

// Eksporter funksjoner for bruk i andre filer
window.saveFiltersToDatabase = saveFiltersToDatabase;
window.getFiltersFromDatabase = getFiltersFromDatabase;