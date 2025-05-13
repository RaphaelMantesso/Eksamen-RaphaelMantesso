// Teste para autenticação (Página 1)

// Testes
describe('Autentisering (Side 1)', () => {
  // Teste 1: Validering av brukernavn
  test('Validering av brukernavn', () => {
    // Arrange
    const validUsername = 'testuser';
    const invalidUsername = 'ab';

    // Funksjon for validering av brukernavn
    const validateUsername = (username) => username && username.length >= 3;

    // Act & Assert
    expect(validateUsername(validUsername)).toBe(true);
    expect(validateUsername(invalidUsername)).toBe(false);
  });

  // Teste 2: Validering av passord
  test('Validering av passord', () => {
    // Arrange
    const validPassword = 'password123';
    const invalidPassword = 'pass';

    // Funksjon for validering av passord
    const validatePassword = (password) => password && password.length >= 6;

    // Act & Assert
    expect(validatePassword(validPassword)).toBe(true);
    expect(validatePassword(invalidPassword)).toBe(false);
  });
});
