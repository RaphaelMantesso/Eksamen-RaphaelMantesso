// Hovedapplikasjonsfil for dating-appen

// Globale variabler
let currentProfile = null;
let potentialMatches = []; // Array med potensielle matcher
let currentMatchIndex = 0; // Indeks for gjeldende match
let likedUsers = []; // Array med likte brukere

/**
 * Initialiserer applikasjonen
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

    // Last inn filterpreferanser
    await loadFilterPreferences();

    // Last inn likte brukere
    await loadLikedUsers();

    // Sjekk om det er en lagret tilstand for potensielle matcher
    const savedState = localStorage.getItem('matchingState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            // Gjenopprett tilstanden hvis den er gyldig
            if (state.potentialMatches && state.potentialMatches.length > 0 &&
                state.currentMatchIndex !== undefined &&
                state.currentMatchIndex < state.potentialMatches.length) {

                potentialMatches = state.potentialMatches;
                currentMatchIndex = state.currentMatchIndex;

                // Vis gjeldende match
                displayCurrentMatch();
                console.log('Gjenopprettet tidligere matching-tilstand');
            } else {
                // Last inn nye potensielle matcher hvis tilstanden er ugyldig
                loadPotentialMatches();
            }
        } catch (error) {
            console.error('Feil ved gjenoppretting av matching-tilstand:', error);
            // Last inn nye potensielle matcher ved feil
            loadPotentialMatches();
        }
    } else {
        // Last inn potensielle matcher hvis ingen lagret tilstand
        loadPotentialMatches();
    }

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

    // Konfigurer filter-knapper
    const filterForm = document.getElementById('filterForm');
    const saveFilterBtn = document.getElementById('saveFilterBtn');

    if (filterForm) {
        filterForm.addEventListener('submit', handleFilterSubmit);
        console.log('Hendelseslytter for "Bruk Filter" konfigurert i setupEventListeners');
    }

    if (saveFilterBtn) {
        saveFilterBtn.addEventListener('click', saveFilterPreferences);
        console.log('Hendelseslytter for "Lagre Filter" konfigurert i setupEventListeners');
    }
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
        matchesContainer.innerHTML = '<p class="loading-text">Laster potensielle matcher...</p>';

        const response = await fetch('https://randomuser.me/api/?results=20&nat=no,dk,se');

        if (!response.ok) {
            throw new Error('Kunne ikke hente potensielle matcher');
        }

        const data = await response.json();
        const users = data.results;

        console.log('Brukere mottatt fra API:', users);
        console.log('Filtre brukt:', getFilters());

        // Filtrer brukere basert på filterkriterier
        potentialMatches = filterUsers(users);
        console.log('Brukere etter filtrering:', potentialMatches);

        // Tilbakestill indeks
        currentMatchIndex = 0;

        // Lagre den nye tilstanden
        saveMatchingState();

        // Vis første match eller "ingen matcher" melding
        if (potentialMatches.length > 0) {
            displayCurrentMatch();
        } else {
            matchesContainer.innerHTML = '<p class="no-more-matches">Ingen potensielle matcher funnet basert på dine preferanser.</p>';
            // Tøm lagret tilstand siden det ikke er noen matcher
            localStorage.removeItem('matchingState');
        }

    } catch (error) {
        console.error('Feil ved lasting av potensielle matcher:', error);
        matchesContainer.innerHTML = '<p class="error">Kunne ikke laste potensielle matcher. Vennligst prøv igjen senere.</p>';
    }
}

/**
 * Viser gjeldende match
 */
function displayCurrentMatch() {
    const matchesContainer = document.getElementById('potentialMatches');
    if (!matchesContainer) return;

    // Sjekk om det er flere matcher tilgjengelig
    if (currentMatchIndex >= potentialMatches.length) {
        matchesContainer.innerHTML = '<p class="no-more-matches">Ingen flere matcher tilgjengelig. Last inn flere?</p>';

        // Legg til en knapp for å laste inn flere matcher
        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'btn';
        reloadBtn.textContent = 'Last inn flere matcher';
        reloadBtn.addEventListener('click', loadPotentialMatches);

        matchesContainer.appendChild(reloadBtn);

        // Tøm lagret tilstand siden det ikke er flere matcher
        localStorage.removeItem('matchingState');
        return;
    }

    // Hent gjeldende bruker
    const user = potentialMatches[currentMatchIndex];

    // Lagre gjeldende tilstand
    saveMatchingState();

    // Tøm container
    matchesContainer.innerHTML = '';

    // Opprett match-kort
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.id = 'currentMatchCard';

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
            <button class="dislike-btn" data-id="${user.login.uuid}">✕</button>
            <button class="like-btn" data-id="${user.login.uuid}">♥</button>
            <!-- Tilleggsfunksjonalitet: Super Like -->
            <button class="super-like-btn" data-id="${user.login.uuid}">★</button>
        </div>
    `;

    matchesContainer.appendChild(matchCard);

    // Legg til event listeners for knappene
    const likeBtn = matchCard.querySelector('.like-btn');
    const dislikeBtn = matchCard.querySelector('.dislike-btn');
    const superLikeBtn = matchCard.querySelector('.super-like-btn');

    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            handleSwipe('right', user);
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', () => {
            handleSwipe('left', user);
        });
    }

    // Tilleggsfunksjonalitet: Super Like
    if (superLikeBtn) {
        superLikeBtn.addEventListener('click', () => {
            handleSuperLike(user);
        });
    }
}

/**
 * Lagrer gjeldende matching-tilstand i localStorage
 */
function saveMatchingState() {
    const state = {
        potentialMatches,
        currentMatchIndex
    };

    localStorage.setItem('matchingState', JSON.stringify(state));
    console.log('Matching-tilstand lagret');
}

/**
 * Tilleggsfunksjonalitet: Håndterer super-like
 * @param {Object} user - Brukerobjektet som ble super-likt
 */
function handleSuperLike(user) {
    const matchCard = document.getElementById('currentMatchCard');
    if (!matchCard) return;

    // Legg til animasjonsklasse
    matchCard.classList.add('super-liked');
    console.log('Super-likt bruker:', user.login.uuid);

    // Lagre super-like i databasen (true indikerer at dette er en super-like)
    saveLikedUser(user, true);

    // Vis en spesiell melding for super-like
    alert('Du har gitt et Super Like! Brukeren vil se at du er ekstra interessert.');

    // Vent på at animasjonen skal fullføres før neste kort vises
    setTimeout(() => {
        // Gå til neste match
        currentMatchIndex++;
        displayCurrentMatch();
    }, 300); // 300ms er varigheten på animasjonen
}

/**
 * Filtrerer brukere basert på filterkriterier
 * @param {Array} users - Liste med potensielle matcher
 * @returns {Array} - Filtrert liste med matcher
 */
function filterUsers(users) {
    const filters = getFilters();

    console.log('Bruker følgende filtre:', filters);

    // Filtrer brukere basert på filterkriterier
    const filteredUsers = users.filter(user => {
        // Filtrer på kjønn
        if (filters.gender !== 'all') {
            if (user.gender !== filters.gender) {
                return false;
            }
        }

        // Filtrer på alder
        if (user.dob.age < filters.minAge || user.dob.age > filters.maxAge) {
            return false;
        }

        return true;
    });

    // Filtrer også basert på brukerens preferanser hvis tilgjengelig
    const filteredByPreference = currentProfile ?
        filterUsersByPreference(filteredUsers, currentProfile) :
        filteredUsers;

    console.log(`Filtrert fra ${users.length} til ${filteredByPreference.length} brukere`);
    return filteredByPreference;
}

/**
 * Henter gjeldende filterinnstillinger
 * @returns {Object} - Filterobjekt
 */
function getFilters() {
    // Prøv å hente lagrede filtre fra localStorage (rask tilgang)
    const savedFilters = localStorage.getItem('userFilters');

    if (savedFilters) {
        try {
            const filters = JSON.parse(savedFilters);

            // Sikre at alle nødvendige filterverdier er tilstede
            return {
                minAge: filters.minAge || 18,
                maxAge: filters.maxAge || 100,
                gender: filters.gender || 'all'
            };
        } catch (error) {
            console.error('Feil ved parsing av lagrede filtre:', error);
            // Fjern ugyldige filtre
            localStorage.removeItem('userFilters');
        }
    }

    // Standard filterinnstillinger
    return {
        minAge: 18,
        maxAge: 100,
        gender: 'all'
    };
}

/**
 * Håndterer innsending av filterform
 * @param {Event} event - Skjemahendelsen
 */
async function handleFilterSubmit(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const minAge = parseInt(document.getElementById('minAge').value) || 18;
    const maxAge = parseInt(document.getElementById('maxAge').value) || 100;
    const gender = document.getElementById('filterGender').value;

    // Validere aldersfiltre
    if (minAge > maxAge) {
        alert('Alder fra kan ikke være større enn Alder til');
        return;
    }

    // Opprett filterobjekt
    const filters = {
        minAge,
        maxAge,
        gender
    };

    try {
        // Forsøk å lagre i database
        await saveFiltersToDatabase(currentUser.id, filters);
        console.log('Filter lagret i database');

        // Vis bekreftelse til brukeren
        const matchesContainer = document.getElementById('potentialMatches');
        if (matchesContainer) {
            matchesContainer.innerHTML = '<p class="loading-text">Filtre anvendt. Laster nye matcher...</p>';
        }

        // Kort forsinkelse for å vise meldingen
        setTimeout(() => {
            // Bruk filtre og last inn matcher på nytt
            loadPotentialMatches();
        }, 500);

    } catch (error) {
        console.error('Kunne ikke lagre filtre i database:', error);
        alert('Kunne ikke lagre filtre i database. Prøver å bruke filtre lokalt.');

        // Lagre i localStorage som fallback
        localStorage.setItem('userFilters', JSON.stringify(filters));

        // Bruk filtre og last inn matcher på nytt
        loadPotentialMatches();
    }

    console.log('Filter anvendt:', filters);
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
 * Håndterer swipe-handling
 * @param {string} direction - Retning ('left' eller 'right')
 * @param {Object} user - Brukerobjektet som ble swiped
 */
function handleSwipe(direction, user) {
    const matchCard = document.getElementById('currentMatchCard');
    if (!matchCard) return;

    // Legg til animasjonsklasse basert på retning
    if (direction === 'left') {
        matchCard.classList.add('swiped-left');
        console.log('Disliket bruker:', user.login.uuid);
    } else {
        matchCard.classList.add('swiped-right');
        console.log('Likt bruker:', user.login.uuid);

        // Lagre like i databasen
        saveLikedUser(user);
    }

    // Vent på at animasjonen skal fullføres før neste kort vises
    setTimeout(() => {
        // Gå til neste match
        currentMatchIndex++;

        // Oppdater lagret tilstand
        saveMatchingState();

        // Vis neste match
        displayCurrentMatch();
    }, 300); // 300ms er varigheten på animasjonen
}

/**
 * Lagrer en likt bruker i databasen
 * @param {Object} user - Brukerobjektet som ble likt
 * @param {boolean} isSuperLike - Om dette er en super-like
 */
async function saveLikedUser(user, isSuperLike = false) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
        // Opprett et forenklet brukerobjekt for lagring
        const likedUser = {
            userId: currentUser.id,
            username: currentUser.username,
            likedUserId: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            age: user.dob.age,
            location: `${user.location.city}, ${user.location.country}`,
            picture: user.picture.large,
            isSuperLike: isSuperLike, // Tilleggsfunksjonalitet: Super Like
            timestamp: new Date().toISOString()
        };

        // Lagre i CrudCrud
        const savedUser = await saveLikedUserToDatabase(likedUser);

        if (savedUser) {
            // Legg til i den lokale listen over likte brukere
            likedUsers.push(savedUser);

            // Oppdater visningen av likte brukere
            displayLikedUsers();
        }

        console.log('Bruker lagret som likt:', likedUser);
    } catch (error) {
        console.error('Feil ved lagring av likt bruker:', error);
    }
}

/**
 * Laster inn likte brukere fra databasen
 */
async function loadLikedUsers() {
    const likedUsersContainer = document.getElementById('likedUsers');
    if (!likedUsersContainer) return;

    try {
        likedUsersContainer.innerHTML = '<p class="loading-text">Laster likte profiler...</p>';

        // Hent likte brukere fra databasen
        const fetchedLikedUsers = await getLikedUsersFromDatabase();

        // Oppdater den globale variabelen
        likedUsers = fetchedLikedUsers || [];

        // Vis likte brukere
        displayLikedUsers();

    } catch (error) {
        console.error('Feil ved lasting av likte brukere:', error);
        likedUsersContainer.innerHTML = '<p class="error">Kunne ikke laste likte profiler. Vennligst prøv igjen senere.</p>';
    }
}

/**
 * Viser likte brukere i brukergrensesnittet
 */
function displayLikedUsers() {
    const likedUsersContainer = document.getElementById('likedUsers');
    if (!likedUsersContainer) return;

    // Tøm container
    likedUsersContainer.innerHTML = '';

    if (likedUsers.length === 0) {
        likedUsersContainer.innerHTML = '<p class="no-liked-users">Du har ikke likt noen profiler ennå.</p>';
        return;
    }

    // Sorter likte brukere etter tidspunkt (nyeste først)
    const sortedLikedUsers = [...likedUsers].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Opprett kort for hver likt bruker
    sortedLikedUsers.forEach(user => {
        const likedUserCard = document.createElement('div');
        likedUserCard.className = 'liked-user-card';
        likedUserCard.dataset.id = user._id; // Bruk CrudCrud ID for sletting

        likedUserCard.innerHTML = `
            <div class="liked-user-image">
                <img src="${user.picture}" alt="Profilbilde">
                ${user.isSuperLike ? '<span class="super-liked-badge">★ Super Like</span>' : ''}
            </div>
            <div class="liked-user-info">
                <h3>${user.name}</h3>
                <p>Alder: ${user.age}</p>
                <p>Sted: ${user.location}</p>
            </div>
            <button class="remove-like-btn" data-id="${user._id}">✕</button>
        `;

        likedUsersContainer.appendChild(likedUserCard);

        // Legg til event listener for sletting
        const removeBtn = likedUserCard.querySelector('.remove-like-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeLikedUser(user._id));
        }
    });
}

/**
 * Fjerner en likt bruker fra databasen og brukergrensesnittet
 * @param {string} likedUserId - ID til den likte brukeren som skal fjernes
 */
async function removeLikedUser(likedUserId) {
    try {
        // Fjern fra databasen
        await removeLikedUserFromDatabase(likedUserId);

        // Fjern fra den lokale listen
        likedUsers = likedUsers.filter(user => user._id !== likedUserId);

        // Oppdater visningen
        displayLikedUsers();

        console.log('Likt bruker fjernet:', likedUserId);
    } catch (error) {
        console.error('Feil ved fjerning av likt bruker:', error);
        alert('Kunne ikke fjerne profilen. Vennligst prøv igjen senere.');
    }
}

/**
 * Fjerner en likt bruker fra databasen
 * @param {string} likedUserId - ID til den likte brukeren som skal fjernes
 * @returns {Promise} - Promise med resultatet av operasjonen
 */
async function removeLikedUserFromDatabase(likedUserId) {
    try {
        const response = await fetch(`${LIKES_ENDPOINT}/${likedUserId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Kunne ikke fjerne likt bruker');
        }

        return true;
    } catch (error) {
        console.error('Feil ved fjerning av likt bruker fra database:', error);
        throw error;
    }
}

/**
 * Lagrer en likt bruker i databasen
 * @param {Object} likedUser - Objektet med informasjon om den likte brukeren
 * @returns {Promise} - Promise med resultatet av operasjonen
 */
async function saveLikedUserToDatabase(likedUser) {
    try {
        const LIKES_ENDPOINT = `${API_URL}/likes`;

        const response = await fetch(LIKES_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likedUser)
        });

        if (!response.ok) {
            throw new Error('Kunne ikke lagre likt bruker');
        }

        return await response.json();
    } catch (error) {
        console.error('Feil ved lagring av likt bruker i database:', error);
        throw error;
    }
}

/**
 * Lagrer brukerens filterpreferanser i database og localStorage
 */
async function saveFilterPreferences() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const minAge = parseInt(document.getElementById('minAge').value) || 18;
    const maxAge = parseInt(document.getElementById('maxAge').value) || 100;
    const gender = document.getElementById('filterGender').value;

    // Validere aldersfiltre
    if (minAge > maxAge) {
        alert('Alder fra kan ikke være større enn Alder til');
        return;
    }

    const filters = {
        minAge,
        maxAge,
        gender
    };

    try {
        // Forsøk å lagre i database
        const result = await saveFiltersToDatabase(currentUser.id, filters);

        if (result) {
            // Lagre også i localStorage for rask tilgang
            localStorage.setItem('userFilters', JSON.stringify(filters));

            // Vis bekreftelse til brukeren
            alert('Filterpreferanser lagret i databasen!');
            console.log('Filter lagret i database:', filters);
        }
    } catch (error) {
        console.error('Kunne ikke lagre filtre i database:', error);

        // Fallback til localStorage
        localStorage.setItem('userFilters', JSON.stringify(filters));

        // Vis bekreftelse til brukeren
        alert('Kunne ikke lagre i database. Filterpreferanser lagret lokalt i stedet.');
        console.log('Filter lagret i localStorage:', filters);
    }
}

/**
 * Laster inn lagrede filterpreferanser fra database eller localStorage
 */
async function loadFilterPreferences() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
        // Forsøk å hente fra database først
        const databaseFilters = await getFiltersFromDatabase(currentUser.id);

        if (databaseFilters) {
            // Sett verdier i skjemaet
            const minAgeInput = document.getElementById('minAge');
            const maxAgeInput = document.getElementById('maxAge');
            const genderSelect = document.getElementById('filterGender');

            // Hent filterverdier fra databaseobjektet
            // Sjekk om verdiene eksisterer og er gyldige
            const minAge = typeof databaseFilters.minAge === 'number' ? databaseFilters.minAge : 18;
            const maxAge = typeof databaseFilters.maxAge === 'number' ? databaseFilters.maxAge : 100;
            const gender = databaseFilters.gender || 'all';

            if (minAgeInput) minAgeInput.value = minAge;
            if (maxAgeInput) maxAgeInput.value = maxAge;
            if (genderSelect) genderSelect.value = gender;

            // Oppdater også localStorage for rask tilgang
            localStorage.setItem('userFilters', JSON.stringify({
                minAge,
                maxAge,
                gender
            }));

            console.log('Filtreringspreferanser lastet fra database:', databaseFilters);
            return;
        }
    } catch (error) {
        console.error('Feil ved henting av filtre fra database:', error);
        console.log('Fallback til localStorage');
    }

    // Fallback til localStorage hvis database-henting feilet
    const savedFilters = localStorage.getItem('userFilters');

    if (savedFilters) {
        try {
            const filters = JSON.parse(savedFilters);

            // Sett verdier i skjemaet
            const minAgeInput = document.getElementById('minAge');
            const maxAgeInput = document.getElementById('maxAge');
            const genderSelect = document.getElementById('filterGender');

            if (minAgeInput) minAgeInput.value = filters.minAge || 18;
            if (maxAgeInput) maxAgeInput.value = filters.maxAge || 100;
            if (genderSelect) genderSelect.value = filters.gender || 'all';

            console.log('Filtreringspreferanser lastet fra localStorage:', filters);
        } catch (error) {
            console.error('Feil ved lasting av filtreringspreferanser fra localStorage:', error);
            // Tilbakestill til standardverdier ved feil
            localStorage.removeItem('userFilters');
        }
    } else {
        console.log('Ingen lagrede filtreringspreferanser funnet');
    }
}

// Initialisering av applikasjonen
document.addEventListener('DOMContentLoaded', () => {
    // Sjekk om brukeren er innlogget
    const currentUser = getCurrentUser();

    if (!currentUser) {
        // Omdirigere til innloggingssiden hvis ikke innlogget
        window.location.href = 'index.html';
        return;
    }

    // Initialisere applikasjonen
    initApp();
});