// Test for matching-funksjonalitet (Side 2)

// Konfigurere localStorage mock
beforeEach(() => {
  // Tømme localStorage før hver test
  window.localStorage.clear();
});

describe('Matching-funksjonalitet (Side 2)', () => {
  // Test 1: Filtrering av brukere basert på alder og kjønn
  test('Filtrering av brukere basert på alder og kjønn', () => {
    // Forberedelse
    const brukere = [
      {
        login: { uuid: 'bruker1' },
        name: { first: 'John', last: 'Doe' },
        dob: { age: 25 },
        gender: 'male'
      },
      {
        login: { uuid: 'bruker2' },
        name: { first: 'Jane', last: 'Smith' },
        dob: { age: 30 },
        gender: 'female'
      },
      {
        login: { uuid: 'bruker3' },
        name: { first: 'Bob', last: 'Johnson' },
        dob: { age: 45 },
        gender: 'male'
      }
    ];

    const filtre = {
      minAge: 20,
      maxAge: 40,
      gender: 'male'
    };

    // Funksjon for filtrering av brukere
    const filtrerBrukere = (brukere, filtre) => {
      return brukere.filter(bruker => {
        // Filtrer på kjønn
        if (filtre.gender !== 'all') {
          if (bruker.gender !== filtre.gender) {
            return false;
          }
        }

        // Filtrer på alder
        if (bruker.dob.age < filtre.minAge || bruker.dob.age > filtre.maxAge) {
          return false;
        }

        return true;
      });
    };

    // Handling
    const filtrertebrukere = filtrerBrukere(brukere, filtre);

    // Kontroll
    expect(filtrertebrukere.length).toBe(1);
    expect(filtrertebrukere[0].login.uuid).toBe('bruker1');
  });

  // Test 2: Super Like funksjonalitet
  test('Super Like funksjonalitet', () => {
    // Forberedelse
    const bruker = {
      login: { uuid: 'bruker1' },
      name: { first: 'John', last: 'Doe' },
      dob: { age: 25 },
      location: { city: 'Oslo', country: 'Norway' },
      picture: { large: 'https://example.com/pic1.jpg' },
      gender: 'male'
    };

    const gjeldendeBruker = {
      id: '123',
      username: 'testbruker'
    };

    // Funksjon for å lage et likedUser-objekt
    const opprettLiktBruker = (bruker, gjeldendeBruker, erSuperLike = false) => {
      return {
        userId: gjeldendeBruker.id,
        username: gjeldendeBruker.username,
        likedUserId: bruker.login.uuid,
        name: `${bruker.name.first} ${bruker.name.last}`,
        age: bruker.dob.age,
        location: `${bruker.location.city}, ${bruker.location.country}`,
        picture: bruker.picture.large,
        isSuperLike: erSuperLike,
        timestamp: new Date().toISOString()
      };
    };

    // Handling
    const vanligLike = opprettLiktBruker(bruker, gjeldendeBruker, false);
    const superLike = opprettLiktBruker(bruker, gjeldendeBruker, true);

    // Kontroll
    expect(vanligLike.isSuperLike).toBe(false);
    expect(superLike.isSuperLike).toBe(true);
    expect(superLike.name).toBe('John Doe');
    expect(superLike.location).toBe('Oslo, Norway');
  });
});
