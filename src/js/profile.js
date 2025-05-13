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
        // Sjekk om brukeren er innlogget
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return null;
        }
        
        // Hent brukerprofil fra localStorage
        const profilesJson = localStorage.getItem('datingAppProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : [];
        
        // Finn profilen til brukeren
        const userProfile = profiles.find(profile => profile.userId === userId);
        
        // Hvis profilen ikke finnes, returner en standardprofil
        if (!userProfile) {
            return await createDefaultProfile(currentUser);
        }
        
        return userProfile;
    } catch (error) {
        console.error('Feil ved henting av brukerprofil:', error);
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
        userId: user.id,
        name: user.username,
        age: 25,
        location: 'Oslo',
        bio: 'Hei! Jeg er ny på denne appen.',
        imageUrl: 'images/avatar-1.png',
        avatar: 'avatar-1',
        gender: 'other',
        preference: 'both'
    };
    
    try {
        // Hent eksisterende profiler
        const profilesJson = localStorage.getItem('datingAppProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : [];
        
        // Legg til ny profil
        profiles.push(defaultProfile);
        
        // Lagre oppdatert profilliste
        localStorage.setItem('datingAppProfiles', JSON.stringify(profiles));
        
        return defaultProfile;
    } catch (error) {
        console.error('Feil ved oppretting av standardprofil:', error);
        return defaultProfile;
    }
}

/**
 * Oppdaterer brukerprofilen i localStorage
 * @param {string} userId - Brukerens ID
 * @param {UserProfile} profileData - Profildata som skal oppdateres
 * @returns {Promise<UserProfile|null>} - Promise med oppdatert profil eller null
 */
async function updateUserProfile(userId, profileData) {
    try {
        // Hent eksisterende profiler
        const profilesJson = localStorage.getItem('datingAppProfiles');
        const profiles = profilesJson ? JSON.parse(profilesJson) : [];
        
        // Finn indeksen til profilen som skal oppdateres
        const profileIndex = profiles.findIndex(profile => profile.userId === userId);
        
        if (profileIndex === -1) {
            // Hvis profilen ikke finnes, legg til en ny
            profiles.push(profileData);
        } else {
            // Oppdater eksisterende profil
            profiles[profileIndex] = profileData;
        }
        
        // Lagre oppdatert profilliste
        localStorage.setItem('datingAppProfiles', JSON.stringify(profiles));
        
        return profileData;
    } catch (error) {
        console.error('Feil ved oppdatering av profil:', error);
        return null;
    }
}

/**
 * Viser brukerprofilen i grensesnittet
 * @param {UserProfile} profile - Brukerprofilen som skal vises
 */
function displayUserProfile(profile) {
    if (!profile) return;
    
    // Oppdater profilvisningen
    document.getElementById('profileName').textContent = profile.name || 'Laster...';
    document.getElementById('profileAge').textContent = `Alder: ${profile.age || '--'}`;
    document.getElementById('profileLocation').textContent = `Sted: ${profile.location || '--'}`;
    document.getElementById('profileBio').textContent = profile.bio || 'Ingen biografi tilgjengelig.';
    
    // Oppdater kjønn og preferanse hvis elementene finnes
    const genderElement = document.getElementById('profileGender');
    if (genderElement) {
        let genderText = 'Annet';
        if (profile.gender === 'male') genderText = 'Mann';
        if (profile.gender === 'female') genderText = 'Kvinne';
        genderElement.textContent = `Kjønn: ${genderText}`;
    }
    
    const preferenceElement = document.getElementById('profilePreference');
    if (preferenceElement) {
        let preferenceText = 'Begge';
        if (profile.preference === 'male') preferenceText = 'Menn';
        if (profile.preference === 'female') preferenceText = 'Kvinner';
        preferenceElement.textContent = `Interessert i: ${preferenceText}`;
    }
    
    // Oppdater profilbildet hvis tilgjengelig
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        if (profile.avatar) {
            profileImage.src = `images/${profile.avatar}.png`;
            profileImage.onerror = function() {
                // Fallback til default-avatar hvis bildet ikke finnes
                this.src = 'images/default-avatar.png';
            };
        } else if (profile.imageUrl) {
            profileImage.src = profile.imageUrl;
            profileImage.onerror = function() {
                // Fallback til default-avatar hvis bildet ikke finnes
                this.src = 'images/default-avatar.png';
            };
        } else {
            profileImage.src = 'images/default-avatar.png';
        }
    }
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