# Tester for Dating App

Dette dokumentet beskriver testene som er implementert for Dating App-applikasjonen.

## Teststruktur

Testene er organisert i følgende filer:

1. `auth.test.js` - Tester for autentisering (Side 1)
2. `profile.test.js` - Tester for brukerprofil (Side 2)
3. `matching.test.js` - Tester for matching-funksjonalitet (Side 2)

## Kjøre testene

For å kjøre testene, bruk følgende kommando:

```bash
npm test
```

## Testdekning

### Side 1 (Innlogging)
- Validering av brukernavn
- Validering av passord

### Side 2 (Dating App)
- Lagring og henting av brukerprofil i localStorage
- Validering av profildata
- Filtrering av brukere basert på alder og kjønn
- Super Like funksjonalitet

## Testmetodikk

Testene er skrevet med Jest og følger AAA-mønsteret (Arrange, Act, Assert):

1. **Arrange**: Sette opp testdata og forutsetninger
2. **Act**: Utføre handlingen som skal testes
3. **Assert**: Verifisere at resultatet er som forventet

## Mocking

Testene bruker mocking for å simulere:
- localStorage
- DOM-elementer

Dette gjør at testene kan kjøre uavhengig av en faktisk nettleser og API-tilkobling.
