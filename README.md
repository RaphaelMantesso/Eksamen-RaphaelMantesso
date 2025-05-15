# Dating App - Eksamensprosjekt

Dette er en dating-applikasjon utviklet som eksamensprosjekt i JavaScript og API-programmering.

## Prosjektbeskrivelse

Applikasjonen er en dating-plattform der brukere kan registrere seg, logge inn, opprette en profil, og finne potensielle matcher basert på preferanser. Applikasjonen består av to hovedsider:

1. Innloggingsside (Side 1): Registrering og innlogging av brukere
2. Dating App (Side 2): Profilvisning, filtrering, og matching-funksjonalitet

## Funksjonalitet

### Side 1 - Innlogging
- Registrering av nye brukere med brukernavn og passord
- Innlogging med eksisterende brukerkontoer
- Validering av brukerinput
- Lagring av brukerdata i database (CrudCrud)

### Side 2 - Dating App
- Visning og redigering av brukerprofil
- Filtrering av potensielle matcher basert på alder og kjønn
- Matching-funksjonalitet med "ja/nei"-valg
- Visning av én tilfeldig bruker om gangen
- Lagring av likte brukere i database
- Mulighet for å slette likte brukere

### Tilleggsfunksjonalitet
- Super Like: Mulighet for å gi en spesiell "Super Like" til brukere man er ekstra interessert i

## Teknologier

- HTML, CSS og JavaScript
- RandomUser API for generering av potensielle matcher
- CrudCrud API for lagring av brukerdata, preferanser og likes
- Jest for testing

## Installasjon og kjøring

1. Klone prosjektet:
```bash
git clone https://github.com/RaphaelMantesso/Eksamen-RaphaelMantesso.git
cd Eksamen-RaphaelMantesso
```

2. Åpne prosjektet i en nettleser:
- Åpne `index.html` for innloggingssiden
- Etter innlogging blir du automatisk videresendt til `app.html`

## API-nøkkel

Applikasjonen bruker CrudCrud API for datalagring. API-nøkkelen er:
```
1c7a08218e96445dbeaf766d825d1f20
```

## Testing

Prosjektet inneholder tester for både Side 1 og Side 2. For å kjøre testene:

```bash
npm test
```

Testene dekker:
- Validering av brukernavn og passord
- Lagring og henting av brukerprofil
- Validering av profildata
- Filtrering av brukere basert på alder og kjønn
- Super Like-funksjonalitet

## Prosjektstruktur

```
/
├── src/
│   ├── js/
│   │   ├── app.js         # Hovedlogikk for dating-appen
│   │   ├── auth.js        # Autentiseringslogikk
│   │   ├── database.js    # Database-interaksjon
│   │   └── profile.js     # Profilhåndtering
│   ├── styles/
│   │   ├── app.css        # Stiler for dating-appen
│   │   └── index.css      # Stiler for innloggingssiden
│   ├── app.html           # Dating-app siden (Side 2)
│   └── index.html         # Innloggingsside (Side 1)
├── tests/
│   ├── auth.test.js       # Tester for autentisering
│   ├── profile.test.js    # Tester for brukerprofil
│   └── matching.test.js   # Tester for matching-funksjonalitet
├── package.json
└── README.md
```

## Bruk av applikasjonen

1. Registrering/Innlogging:
   - Registrer en ny bruker med brukernavn og passord
   - Logg inn med eksisterende bruker

2. Profilredigering:
   - Oppdater profilinformasjon (navn, alder, sted, etc.)
   - Last opp profilbilde

3. Filtrering:
   - Angi preferanser for alder og kjønn
   - Lagre filterpreferanser

4. Matching:
   - Bla gjennom potensielle matcher
   - Velg "ja" eller "nei" for hver bruker
   - Gi "Super Like" til spesielt interessante brukere
   - Se oversikt over likte brukere
   - Fjern likte brukere ved behov

## Utviklet av
Raphael Mantesso
