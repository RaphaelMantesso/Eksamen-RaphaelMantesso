// Teste para matching (Página 2)

// Configurar localStorage mock
beforeEach(() => {
  // Limpar localStorage antes de cada teste
  window.localStorage.clear();
});

describe('Matching-funksjonalitet (Side 2)', () => {
  // Teste 1: Filtrering av brukere basert på alder og kjønn
  test('Filtrering av brukere basert på alder og kjønn', () => {
    // Arrange
    const users = [
      {
        login: { uuid: 'user1' },
        name: { first: 'John', last: 'Doe' },
        dob: { age: 25 },
        gender: 'male'
      },
      {
        login: { uuid: 'user2' },
        name: { first: 'Jane', last: 'Smith' },
        dob: { age: 30 },
        gender: 'female'
      },
      {
        login: { uuid: 'user3' },
        name: { first: 'Bob', last: 'Johnson' },
        dob: { age: 45 },
        gender: 'male'
      }
    ];

    const filters = {
      minAge: 20,
      maxAge: 40,
      gender: 'male'
    };

    // Funksjon for filtrering av brukere
    const filterUsers = (users, filters) => {
      return users.filter(user => {
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
    };

    // Act
    const filteredUsers = filterUsers(users, filters);

    // Assert
    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].login.uuid).toBe('user1');
  });

  // Teste 2: Super Like funksjonalitet
  test('Super Like funksjonalitet', () => {
    // Arrange
    const user = {
      login: { uuid: 'user1' },
      name: { first: 'John', last: 'Doe' },
      dob: { age: 25 },
      location: { city: 'Oslo', country: 'Norway' },
      picture: { large: 'https://example.com/pic1.jpg' },
      gender: 'male'
    };

    const currentUser = {
      id: '123',
      username: 'testuser'
    };

    // Funksjon for å lage et likedUser-objekt
    const createLikedUser = (user, currentUser, isSuperLike = false) => {
      return {
        userId: currentUser.id,
        username: currentUser.username,
        likedUserId: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        location: `${user.location.city}, ${user.location.country}`,
        picture: user.picture.large,
        isSuperLike: isSuperLike,
        timestamp: new Date().toISOString()
      };
    };

    // Act
    const regularLike = createLikedUser(user, currentUser, false);
    const superLike = createLikedUser(user, currentUser, true);

    // Assert
    expect(regularLike.isSuperLike).toBe(false);
    expect(superLike.isSuperLike).toBe(true);
    expect(superLike.name).toBe('John Doe');
    expect(superLike.location).toBe('Oslo, Norway');
  });
});
