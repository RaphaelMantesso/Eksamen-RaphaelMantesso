// Teste para perfil (Página 2)

// Configurar localStorage mock
beforeEach(() => {
  // Limpar localStorage antes de cada teste
  window.localStorage.clear();
});

describe('Brukerprofil (Side 2)', () => {
  // Teste 1: Lagring og henting av brukerprofil i localStorage
  test('Lagring og henting av brukerprofil i localStorage', () => {
    // Arrange
    const userId = '123';
    const userProfile = {
      id: userId,
      name: 'Test Bruker',
      age: 30,
      location: 'Oslo',
      bio: 'Dette er en test',
      gender: 'male',
      preference: 'female',
      avatar: 'avatar-1'
    };

    const profiles = {};
    profiles[userId] = userProfile;

    // Act
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    const retrievedProfilesJson = localStorage.getItem('userProfiles');
    const retrievedProfiles = JSON.parse(retrievedProfilesJson);

    // Assert
    expect(retrievedProfiles[userId]).toEqual(userProfile);
  });

  // Teste 2: Validering av profildata
  test('Validering av profildata', () => {
    // Arrange
    const validProfile = {
      name: 'Test Bruker',
      age: 30,
      location: 'Oslo',
      bio: 'Dette er en test',
      gender: 'male',
      preference: 'female'
    };

    const invalidProfile = {
      name: '',
      age: 15,
      location: '',
      bio: '',
      gender: 'invalid',
      preference: 'invalid'
    };

    // Funksjon for validering av profil
    const validateProfile = (profile) => {
      if (!profile.name || profile.name.length < 2) return false;
      if (!profile.age || profile.age < 18) return false;
      if (!profile.location || profile.location.length < 2) return false;
      if (!['male', 'female', 'other'].includes(profile.gender)) return false;
      if (!['male', 'female', 'both'].includes(profile.preference)) return false;
      return true;
    };

    // Act & Assert
    expect(validateProfile(validProfile)).toBe(true);
    expect(validateProfile(invalidProfile)).toBe(false);
  });
});
