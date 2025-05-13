// Teste para autenticação (Página 1)

// Mock das funções globais
global.showMessage = jest.fn();
global.saveUser = jest.fn().mockImplementation((username, password) => {
  return Promise.resolve({
    id: '123',
    username,
    createdAt: new Date().toISOString()
  });
});

// Importar funções para teste
const fs = require('fs');
const path = require('path');
const authJsPath = path.join(__dirname, '../src/js/auth.js');
const authJsContent = fs.readFileSync(authJsPath, 'utf8');

// Avaliar o conteúdo do arquivo para ter acesso às funções
// Isso é necessário porque estamos testando funções que não são exportadas
const authFunctions = {};
const evalContext = {
  document: {
    addEventListener: jest.fn(),
    getElementById: jest.fn().mockImplementation(() => ({
      addEventListener: jest.fn(),
      value: ''
    }))
  },
  validateUsername: (username) => username && username.length >= 3,
  validatePassword: (password) => password && password.length >= 6,
  showMessage,
  saveUser,
  handleRegistration: null,
  handleLogin: null
};

// Avaliar o código para extrair as funções
Function('document', 'validateUsername', 'validatePassword', 'showMessage', 'saveUser', 
  'handleRegistration', 'handleLogin',
  `
    ${authJsContent}
    this.validateUsername = validateUsername;
    this.validatePassword = validatePassword;
    this.handleRegistration = handleRegistration;
    this.handleLogin = handleLogin;
  `
).call(authFunctions, evalContext.document, evalContext.validateUsername, 
  evalContext.validatePassword, evalContext.showMessage, evalContext.saveUser);

// Testes
describe('Autentisering (Side 1)', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar mocks do DOM
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === 'registerUsername') {
        return { value: 'testuser' };
      } else if (id === 'registerPassword') {
        return { value: 'password123' };
      } else if (id === 'loginUsername') {
        return { value: 'testuser' };
      } else if (id === 'loginPassword') {
        return { value: 'password123' };
      } else if (id === 'message') {
        return { textContent: '', className: '' };
      }
      return null;
    });
  });

  // Teste 1: Registrering av bruker
  test('Registrering av bruker med gyldig brukernavn og passord', () => {
    // Arrange
    const event = { preventDefault: jest.fn() };
    
    // Act
    authFunctions.handleRegistration(event);
    
    // Assert
    expect(event.preventDefault).toHaveBeenCalled();
    expect(saveUser).toHaveBeenCalledWith('testuser', 'password123');
  });

  // Teste 2: Validering av brukernavn
  test('Validering av brukernavn', () => {
    // Arrange
    const validUsername = 'testuser';
    const invalidUsername = 'ab';
    
    // Act & Assert
    expect(authFunctions.validateUsername(validUsername)).toBe(true);
    expect(authFunctions.validateUsername(invalidUsername)).toBe(false);
  });
});
