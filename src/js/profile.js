// Profilhåndtering for dating-appen

/**
 * Brukerprofilobjekt
 * @typedef {Object} UserProfile
 * @property {string} name - Brukerens navn
 * @property {number} age - Brukerens alder
 * @property {string} location - Brukerens sted
 * @property {string} bio - Brukerens biografi
 * @property {string} imageUrl - URL til brukerens profilbilde
 * @property {string} gender - Brukerens kjønn (male/female/other)
 * @property {string} preference - Brukerens preferanse (male/female/both)
 * @property {string} avatar - Brukerens valgte avatar
 */

/**
 * Henter brukerprofilen fra localStorage
 * @param {string} userId - Brukerens ID
 * @returns {Promise<UserProfile|null>} - Promise med brukerprofilen eller null
 */

async function getUserProfile(userId) {
    try {
        // Sjekk om det finnes en profil i localStorage
        const profilesJson = localStorage.getItem('userProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : {};

        // Hvis profilen eksisterer, returner den
        if (profiles[userId]) {
            console.log('Profil funnet for bruker:', userId);
            console.log('Profil hentet:', profiles[userId]);
            return profiles[userId];
        }

        // Hent brukerinformasjon
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.error('Ingen innlogget bruker funnet');
            return null;
        }

        console.log('Oppretter ny profil for bruker:', currentUser.username);

        // Opprett en standardprofil med brukernavnet
        const defaultProfile = {
            id: userId,
            name: currentUser.username, // Bruk alltid brukernavnet
            age: 25,
            location: 'Oslo',
            bio: 'Hei! Jeg er ny her.',
            gender: 'other',
            preference: 'both',
            avatar: 'avatar-1',
            createdAt: new Date().toISOString()
        };

        // Lagre standardprofilen
        profiles[userId] = defaultProfile;
        localStorage.setItem('userProfiles', JSON.stringify(profiles));

        console.log('Ny profil opprettet med brukernavn:', currentUser.username);
        return defaultProfile;
    } catch (error) {
        console.error('Feil ved henting av brukerprofil:', error);
        return null;
    }
}

// Denne funksjonen er erstattet av den oppdaterte versjonen nedenfor

/**
 * Oppdaterer brukerprofilen i localStorage
 * @param {string} userId - Brukerens ID
 * @param {UserProfile} profileData - Profildata som skal oppdateres
 * @returns {Promise<UserProfile|null>} - Promise med oppdatert profil eller null
 */
// Oppdatere updateUserProfile-funksjonen for å bruke 'userProfiles'
async function updateUserProfile(userId, profileData) {
    try {
        // Hent eksisterende profiler
        const profilesJson = localStorage.getItem('userProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : {};

        // Oppdater profilen
        profiles[userId] = profileData;

        // Lagre oppdatert profilliste
        localStorage.setItem('userProfiles', JSON.stringify(profiles));

        return profileData;
    } catch (error) {
        console.error('Feil ved oppdatering av profil:', error);
        return null;
    }
}

/**
 * Oppretter en standardprofil for en ny bruker
 * @param {Object} user - Brukerinformasjon
 * @returns {UserProfile} - Standardprofil
 */
async function createDefaultProfile(user) {
    const defaultProfile = {
        id: user.id,
        name: user.username,
        age: 25,
        location: 'Oslo',
        bio: 'Hei! Jeg er ny på denne appen.',
        avatar: 'avatar-1',
        gender: 'other',
        preference: 'both',
        createdAt: new Date().toISOString()
    };

    try {
        // Hent eksisterende profiler
        const profilesJson = localStorage.getItem('userProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : {};

        // Legg til ny profil
        profiles[user.id] = defaultProfile;

        // Lagre oppdatert profilliste
        localStorage.setItem('userProfiles', JSON.stringify(profiles));

        return defaultProfile;
    } catch (error) {
        console.error('Feil ved oppretting av standardprofil:', error);
        return defaultProfile;
    }
}

/**
 * Viser brukerprofilen i grensesnittet
 * @param {UserProfile} profile - Brukerprofilen som skal vises
 */

function displayUserProfile(profile) {
    if (!profile) {
        console.error('Ingen profil å vise');
        return;
    }

    // Oppdatere grensesnittelementer
    const profileName = document.getElementById('profileName');
    const profileAge = document.getElementById('profileAge');
    const profileLocation = document.getElementById('profileLocation');
    const profileGender = document.getElementById('profileGender');
    const profilePreference = document.getElementById('profilePreference');
    const profileBio = document.getElementById('profileBio');
    const profileImage = document.getElementById('profileImage');

    if (profileName) profileName.textContent = profile.name || 'Ingen navn';
    if (profileAge) profileAge.textContent = `Alder: ${profile.age || '--'}`;
    if (profileLocation) profileLocation.textContent = `Sted: ${profile.location || '--'}`;

    // Oversette kjønn for visning
    let genderText = '--';
    if (profile.gender === 'male') genderText = 'Mann';
    else if (profile.gender === 'female') genderText = 'Kvinne';
    else if (profile.gender === 'other') genderText = 'Annet';

    if (profileGender) profileGender.textContent = `Kjønn: ${genderText}`;

    // Oversette preferanse for visning
    let preferenceText = '--';
    if (profile.preference === 'male') preferenceText = 'Menn';
    else if (profile.preference === 'female') preferenceText = 'Kvinner';
    else if (profile.preference === 'both') preferenceText = 'Begge';

    if (profilePreference) profilePreference.textContent = `Interessert i: ${preferenceText}`;

    if (profileBio) profileBio.textContent = profile.bio || 'Ingen biografi tilgjengelig';

    // Oppdatere profilbilde
    if (profileImage && profile.avatar) {
        profileImage.src = `images/${profile.avatar}.png`;
    }

    // I begynnelsen av displayUserProfile-funksjonen
    console.log('Viser profil:', profile);
    console.log('Profil vist vellykket:', profile);
}

/**
 * Oppdaterer brukerens profilbilde
 * @param {string} userId - Brukerens ID
 * @param {string} avatar - Valgt avatar
 * @returns {Promise<UserProfile|null>} - Promise med oppdatert profil eller null
 */
async function updateProfileAvatar(userId, avatar) {
    try {
        // Hent gjeldende profil
        const profile = await getUserProfile(userId);

        if (!profile) {
            throw new Error('Kunne ikke finne brukerprofil');
        }

        // Oppdater avatar
        const updatedProfile = {
            ...profile,
            avatar: avatar,
            imageUrl: `images/${avatar}.png`
        };

        // Lagre oppdatert profil
        return await updateUserProfile(userId, updatedProfile);
    } catch (error) {
        console.error('Feil ved oppdatering av profilbilde:', error);
        return null;
    }
}