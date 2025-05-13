// Teste para matching (Página 2)

// Mock das funções globais
global.getCurrentUser = jest.fn().mockReturnValue({
  id: '123',
  username: 'testuser',
  createdAt: new Date().toISOString()
});

global.saveLikedUserToDatabase = jest.fn().mockImplementation((likedUser) => {
  return Promise.resolve({
    ...likedUser,
    _id: 'like_123'
  });
});

// Mock do fetch para retornar usuários aleatórios
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      results: [
        {
          login: { uuid: 'user1' },
          name: { first: 'John', last: 'Doe' },
          dob: { age: 25 },
          location: { city: 'Oslo', country: 'Norway' },
          picture: { large: 'https://example.com/pic1.jpg' },
          gender: 'male'
        },
        {
          login: { uuid: 'user2' },
          name: { first: 'Jane', last: 'Smith' },
          dob: { age: 30 },
          location: { city: 'Bergen', country: 'Norway' },
          picture: { large: 'https://example.com/pic2.jpg' },
          gender: 'female'
        }
      ]
    })
  })
);

// Configurar localStorage mock
beforeEach(() => {
  // Limpar localStorage antes de cada teste
  window.localStorage.clear();
  
  // Configurar elementos do DOM
  document.body.innerHTML = `
    <div id="potentialMatches"></div>
    <div id="likedUsers"></div>
  `;
});

describe('Matching-funksjonalitet (Side 2)', () => {
  // Teste 1: Filtrering av brukere
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
    
    // Mock getFilters para retornar filtros específicos
    global.getFilters = jest.fn().mockReturnValue({
      minAge: 20,
      maxAge: 40,
      gender: 'male'
    });
    
    // Importar a função filterUsers
    const { filterUsers } = require('../src/js/app');
    
    // Act
    const filteredUsers = filterUsers(users);
    
    // Assert
    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].login.uuid).toBe('user1');
  });

  // Teste 2: Lagring av likte brukere
  test('Lagring av likte brukere', async () => {
    // Arrange
    const user = {
      login: { uuid: 'user1' },
      name: { first: 'John', last: 'Doe' },
      dob: { age: 25 },
      location: { city: 'Oslo', country: 'Norway' },
      picture: { large: 'https://example.com/pic1.jpg' },
      gender: 'male'
    };
    
    // Importar a função saveLikedUser
    const { saveLikedUser } = require('../src/js/app');
    
    // Act
    await saveLikedUser(user);
    
    // Assert
    expect(saveLikedUserToDatabase).toHaveBeenCalled();
    const callArg = saveLikedUserToDatabase.mock.calls[0][0];
    expect(callArg.likedUserId).toBe('user1');
    expect(callArg.name).toBe('John Doe');
  });

  // Teste 3: Super Like funksjonalitet
  test('Super Like funksjonalitet', async () => {
    // Arrange
    const user = {
      login: { uuid: 'user1' },
      name: { first: 'John', last: 'Doe' },
      dob: { age: 25 },
      location: { city: 'Oslo', country: 'Norway' },
      picture: { large: 'https://example.com/pic1.jpg' },
      gender: 'male'
    };
    
    // Importar a função saveLikedUser
    const { saveLikedUser } = require('../src/js/app');
    
    // Act
    await saveLikedUser(user, true); // true indica um Super Like
    
    // Assert
    expect(saveLikedUserToDatabase).toHaveBeenCalled();
    const callArg = saveLikedUserToDatabase.mock.calls[0][0];
    expect(callArg.likedUserId).toBe('user1');
    expect(callArg.isSuperLike).toBe(true);
  });
});
