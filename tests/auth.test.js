// Test for autentisering (Side 1)

// Tester
describe('Autentisering (Side 1)', () => {
  // Test 1: Validering av brukernavn
  test('Validering av brukernavn', () => {
    // Forberedelse
    const gyldigBrukernavn = 'testuser';
    const ugyldigBrukernavn = 'ab';

    // Funksjon for validering av brukernavn
    const validerBrukernavn = (brukernavn) => brukernavn && brukernavn.length >= 3;

    // Handling og kontroll
    expect(validerBrukernavn(gyldigBrukernavn)).toBe(true);
    expect(validerBrukernavn(ugyldigBrukernavn)).toBe(false);
  });

  // Test 2: Validering av passord
  test('Validering av passord', () => {
    // Forberedelse
    const gyldigPassord = 'password123';
    const ugyldigPassord = 'pass';

    // Funksjon for validering av passord
    const validerPassord = (passord) => passord && passord.length >= 6;

    // Handling og kontroll
    expect(validerPassord(gyldigPassord)).toBe(true);
    expect(validerPassord(ugyldigPassord)).toBe(false);
  });
});
