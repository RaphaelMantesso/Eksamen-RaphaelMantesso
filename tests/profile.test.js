// Teste para perfil (Página 2)

// Mock das funções globais
global.getCurrentUser = jest.fn().mockReturnValue({
  id: '123',
  username: 'testuser',
  createdAt: new Date().toISOString()
});

global.updateUserProfile = jest.fn().mockImplementation((userId, profileData) => {
  return Promise.resolve(profileData);
});

// Configurar localStorage mock
beforeEach(() => {
  // Limpar localStorage antes de cada teste
  window.localStorage.clear();
});

describe('Brukerprofil (Side 2)', () => {
  // Teste 1: Oppretting av standardprofil
  test('Oppretting av standardprofil med brukernavn', async () => {
    // Arrange
    const userId = '123';
    const username = 'testuser';
    
    // Configurar getCurrentUser para retornar um usuário específico
    getCurrentUser.mockReturnValue({
      id: userId,
      username: username,
      createdAt: new Date().toISOString()
    });
    
    // Importar a função getUserProfile
    const { getUserProfile } = require('../src/js/profile');
    
    // Act
    const profile = await getUserProfile(userId);
    
    // Assert
    expect(profile).not.toBeNull();
    expect(profile.name).toBe(username);
    expect(profile.id).toBe(userId);
  });

  // Teste 2: Oppdatering av brukerprofil
  test('Oppdatering av brukerprofil', async () => {
    // Arrange
    const userId = '123';
    const updatedProfile = {
      id: userId,
      name: 'Oppdatert Navn',
      age: 30,
      location: 'Bergen',
      bio: 'Dette er en oppdatert bio',
      gender: 'male',
      preference: 'female',
      avatar: 'avatar-2'
    };
    
    // Importar a função updateUserProfile
    const { updateUserProfile } = require('../src/js/profile');
    
    // Act
    const result = await updateUserProfile(userId, updatedProfile);
    
    // Assert
    expect(result).toEqual(updatedProfile);
    
    // Verificar se o perfil foi salvo no localStorage
    const profilesJson = localStorage.getItem('userProfiles');
    const profiles = JSON.parse(profilesJson);
    expect(profiles[userId]).toEqual(updatedProfile);
  });
});
