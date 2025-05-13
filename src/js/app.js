// Hovedapplikasjonsfil for dating-appen

// Globale variabler
let currentProfile = null;

/**
 * Initializes the application
 */
async function initApp() {
    // Sjekk om brukeren er innlogget
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect til innloggingssiden hvis ikke innlogget
        window.location.href = 'index.html';
        return;
    }
    
    // Last inn brukerprofil
    currentProfile = await getUserProfile(currentUser.id);
    displayUserProfile(currentProfile);
    
    // Sett opp event listeners
    setupEventListeners();
    
    // Last inn potensielle matcher
    loadPotentialMatches();
    
    // Sørg for at modaler er lukket ved oppstart
    const editProfileModal = document.getElementById('editProfileModal');
    if (editProfileModal) {
        editProfileModal.classList.remove('show');
    }
    
    const photoModal = document.getElementById('photoModal');
    if (photoModal) {
        photoModal.classList.remove('show');
    }
}

/**
 * Setter opp event listeners for applikasjonen
 */
function setupEventListeners() {
    // Utloggingsknapp
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Rediger profil-knapp
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }
    
    // Lukk modal-knapp
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditProfileModal);
    }
    
    // Klikk utenfor modal for å lukke
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('editProfileModal');
        if (event.target === modal) {
            closeEditProfileModal();
        }
    });
    
    // Skjema for profilredigering
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Knapp for å endre profilbilde
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', openPhotoModal);
    }
    
    // Lukk foto-modal-knapp
    const photoCloseBtn = document.querySelector('.photo-close-btn');
    if (photoCloseBtn) {
        photoCloseBtn.addEventListener('click', closePhotoModal);
    }
    
    // Klikk på avatar-alternativer
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const avatar = e.currentTarget.dataset.avatar;
            handleAvatarSelection(avatar);
        });
    });
}

/**
 * Åpner modalen for valg av profilbilde
 */
function openPhotoModal() {
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    
    // Marker gjeldende valgt avatar
    if (currentProfile && currentProfile.avatar) {
        const currentAvatar = document.querySelector(`.avatar-option[data-avatar="${currentProfile.avatar}"]`);
        if (currentAvatar) {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            currentAvatar.classList.add('selected');
        }
    }
    
    // Vis modalen
    modal.classList.add('show');
}

/**
 * Lukker modalen for valg av profilbilde
 */
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Håndterer valg av avatar
 * @param {string} avatar - Valgt avatar
 */
async function handleAvatarSelection(avatar) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Oppdater avatar i profilen
        const result = await updateProfileAvatar(currentUser.id, avatar);
        
        if (result) {
            // Oppdater den globale profilvariabelen
            currentProfile = result;
            
            // Oppdater profilvisningen
            displayUserProfile(currentProfile);
            
            // Lukk modalen
            closePhotoModal();
        }
    } catch (error) {
        console.error('Feil ved valg av avatar:', error);
        alert('Det oppstod en feil ved oppdatering av profilbildet. Vennligst prøv igjen senere.');
    }
}

/**
 * Åpner modalen for profilredigering
 */
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.add('show');
        
        // Fyll inn skjemaet med gjeldende profildata
        document.getElementById('editName').value = currentProfile.name || '';
        document.getElementById('editAge').value = currentProfile.age || '';
        document.getElementById('editLocation').value = currentProfile.location || '';
        document.getElementById('editBio').value = currentProfile.bio || '';
        document.getElementById('editGender').value = currentProfile.gender || 'other';
        document.getElementById('editPreference').value = currentProfile.preference || 'both';
        
        // Sett valgt avatar hvis tilgjengelig
        if (currentProfile.avatar) {
            document.getElementById('editPhoto').value = currentProfile.avatar;
        }
    }
}

/**
 * Lukker modalen for profilredigering
 */
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Håndterer oppdatering av brukerprofil
 * @param {Event} event - Skjemahendelsen
 */
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Hent data fra skjemaet
    const name = document.getElementById('editName').value.trim();
    const age = parseInt(document.getElementById('editAge').value);
    const location = document.getElementById('editLocation').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    const gender = document.getElementById('editGender').value;
    const preference = document.getElementById('editPreference').value;
    const avatar = document.getElementById('editPhoto').value;
    
    // Valider input
    if (!name || isNaN(age) || !location) {
        alert('Vennligst fyll ut alle påkrevde felt.');
        return;
    }
    
    // Oppdater profilobjektet
    const updatedProfile = {
        ...currentProfile,
        name,
        age,
        location,
        bio,
        gender,
        preference,
        avatar,
        imageUrl: `images/${avatar}.png`
    };
    
    try {
        // Oppdater profilen i databasen
        const result = await updateUserProfile(currentUser.id, updatedProfile);
        
        if (result) {
            // Oppdater den globale profilvariabelen
            currentProfile = result;
            
            // Oppdater profilvisningen
            displayUserProfile(currentProfile);
            
            // Lukk modalen
            closeEditProfileModal();
            
            // Vis suksessmelding
            alert('Profilen din har blitt oppdatert!');
        }
    } catch (error) {
        console.error('Feil ved oppdatering av profil:', error);
        alert('Det oppstod en feil ved oppdatering av profilen din. Vennligst prøv igjen senere.');
    }
}

/**
 * Laster inn potensielle matcher fra RandomUser API
 */
async function loadPotentialMatches() {
    const matchesContainer = document.getElementById('potentialMatches');
    if (!matchesContainer) return;
    
    try {
        // Vis lastestatus
        matchesContainer.innerHTML = '<p class="loading-text">Laster potensielle matcher...</p>';
        
        // Hent tilfeldige brukere fra RandomUser API
        const response = await fetch('https://randomuser.me/api/?results=6');
        
        if (!response.ok) {
            throw new Error('Kunne ikke hente potensielle matcher');
        }
        
        const data = await response.json();
        const users = data.results;
        
        // Tøm container
        matchesContainer.innerHTML = '';
        
        // Filtrer matcher basert på brukerens preferanser
        const filteredUsers = filterUsersByPreference(users, currentProfile);
        
        // Vis hver potensiell match
        filteredUsers.forEach(user => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            
            matchCard.innerHTML = `
                <div class="match-image">
                    <img src="${user.picture.large}" alt="Profilbilde">
                </div>
                <div class="match-info">
                    <h3>${user.name.first} ${user.name.last}</h3>
                    <p>Alder: ${user.dob.age}</p>
                    <p>Sted: ${user.location.city}, ${user.location.country}</p>
                </div>
                <div class="match-actions">
                    <button class="like-btn" data-id="${user.login.uuid}">Like</button>
                    <button class="dislike-btn" data-id="${user.login.uuid}">Dislike</button>
                </div>
            `;
            
            matchesContainer.appendChild(matchCard);
        });
        
        // Legg til event listeners for like/dislike-knapper
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleLike(e.target.dataset.id));
        });
        
        document.querySelectorAll('.dislike-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDislike(e.target.dataset.id));
        });
        
        // Hvis ingen matcher ble funnet
        if (filteredUsers.length === 0) {
            matchesContainer.innerHTML = '<p class="no-matches">Ingen potensielle matcher funnet basert på dine preferanser.</p>';
        }
        
    } catch (error) {
        console.error('Feil ved lasting av potensielle matcher:', error);
        matchesContainer.innerHTML = '<p class="error">Kunne ikke laste potensielle matcher. Vennligst prøv igjen senere.</p>';
    }
}

/**
 * Filtrerer brukere basert på brukerens preferanser
 * @param {Array} users - Liste med potensielle matcher
 * @param {UserProfile} userProfile - Brukerens profil
 * @returns {Array} - Filtrert liste med matcher
 */
function filterUsersByPreference(users, userProfile) {
    if (!userProfile || !userProfile.preference) {
        return users;
    }
    
    return users.filter(user => {
        const userGender = user.gender === 'male' ? 'male' : 'female';
        
        // Hvis brukeren er interessert i begge kjønn
        if (userProfile.preference === 'both') {
            return true;
        }
        
        // Hvis brukeren er interessert i et spesifikt kjønn
        return userProfile.preference === userGender;
    });
}

/**
 * Håndterer like-handling
 * @param {string} userId - ID til brukeren som ble likt
 */
function handleLike(userId) {
    console.log('Likt bruker:', userId);
    alert('Du likte denne profilen!');
    // Her kan du implementere mer funksjonalitet, som å lagre likes i localStorage
}

/**
 * Håndterer dislike-handling
 * @param {string} userId - ID til brukeren som ble disliket
 */
function handleDislike(userId) {
    console.log('Disliket bruker:', userId);
    // Her kan du implementere mer funksjonalitet, som å fjerne profilen fra visningen
    const matchCard = document.querySelector(`.match-card:has(button[data-id="${userId}"])`);
    if (matchCard) {
        matchCard.style.display = 'none';
    }
}

// Initialiser applikasjonen når DOM er lastet
document.addEventListener('DOMContentLoaded', initApp);