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
- Registrering av bruker med gyldig brukernavn og passord
- Validering av brukernavn

### Side 2 (Dating App)
- Oppretting av standardprofil med brukernavn
- Oppdatering av brukerprofil
- Filtrering av brukere basert på alder og kjønn
- Lagring av likte brukere
- Super Like funksjonalitet

## Mocking

Testene bruker mocking for å simulere:
- localStorage
- fetch API
- DOM-elementer
- Globale funksjoner

Dette gjør at testene kan kjøre uavhengig av en faktisk nettleser og API-tilkobling.
