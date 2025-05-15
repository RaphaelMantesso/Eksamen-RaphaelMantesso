// Test for brukerprofil (Side 2)

// Konfigurere localStorage mock
beforeEach(() => {
  // Tømme localStorage før hver test
  window.localStorage.clear();
});

describe('Brukerprofil (Side 2)', () => {
  // Test 1: Lagring og henting av brukerprofil i localStorage
  test('Lagring og henting av brukerprofil i localStorage', () => {
    // Forberedelse
    const brukerId = '123';
    const brukerProfil = {
      id: brukerId,
      name: 'Test Bruker',
      age: 30,
      location: 'Oslo',
      bio: 'Dette er en test',
      gender: 'male',
      preference: 'female',
      avatar: 'avatar-1'
    };

    const profiler = {};
    profiler[brukerId] = brukerProfil;

    // Handling
    localStorage.setItem('userProfiles', JSON.stringify(profiler));
    const hentetProfilJson = localStorage.getItem('userProfiles');
    const hentetProfil = JSON.parse(hentetProfilJson);

    // Kontroll
    expect(hentetProfil[brukerId]).toEqual(brukerProfil);
  });

  // Test 2: Validering av profildata
  test('Validering av profildata', () => {
    // Forberedelse
    const gyldigProfil = {
      name: 'Test Bruker',
      age: 30,
      location: 'Oslo',
      bio: 'Dette er en test',
      gender: 'male',
      preference: 'female'
    };

    const ugyldigProfil = {
      name: '',
      age: 15,
      location: '',
      bio: '',
      gender: 'invalid',
      preference: 'invalid'
    };

    // Funksjon for validering av profil
    const validerProfil = (profil) => {
      if (!profil.name || profil.name.length < 2) return false;
      if (!profil.age || profil.age < 18) return false;
      if (!profil.location || profil.location.length < 2) return false;
      if (!['male', 'female', 'other'].includes(profil.gender)) return false;
      if (!['male', 'female', 'both'].includes(profil.preference)) return false;
      return true;
    };

    // Handling og kontroll
    expect(validerProfil(gyldigProfil)).toBe(true);
    expect(validerProfil(ugyldigProfil)).toBe(false);
  });
});
