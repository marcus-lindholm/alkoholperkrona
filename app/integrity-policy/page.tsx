import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integritetspolicy',
  description:
    'Integritetspolicy för APKrona: appens funktion, datahantering, transparens kring AI-funktioner och efterlevnad av Google Play-krav.',
  alternates: {
    canonical: 'https://www.apkrona.se/integrity-policy',
  },
};

export default function IntegrityPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-100 text-black px-4 py-10 sm:px-8 md:px-16 lg:px-24">
      <article className="mx-auto w-full max-w-4xl rounded-xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold">Integritetspolicy</h1>
        <p className="mt-2 text-sm text-gray-600">Senast uppdaterad: 5 april 2026</p>

        <p className="mt-6 text-base leading-7">
          Denna integritetspolicy beskriver hur APKrona är byggd och drivs för att vara transparent,
          saklig och förenlig med Google Plays krav på appintegritet och användarförtroende.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">1. Vad appen gör</h2>
          <p className="mt-3 leading-7">
            APKrona visar dryckeslistor och ranking baserat på beräkningar av alkohol per krona. Produkt-
            och rankingdata lagras i en PostgreSQL-databas och exponeras via API-endpoints i denna
            kodbas.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">2. Datakällor och korrekthet</h2>
          <p className="mt-3 leading-7">
            Appen behandlar produktkatalogdata från en extern källa och länkar produkter till
            Systembolagets sidor. Data uppdateras via backend-processer och rankningshistorik lagras över
            tid.
          </p>
          <p className="mt-3 leading-7">
            Vi strävar efter att visa aktuell och korrekt information, men priser, tillgänglighet och
            katalogdetaljer kan ändras utanför appen. Användare bör verifiera viktig information på
            officiella produktsidor innan beslut fattas.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">3. Användardata och integritetsrelevant beteende</h2>
          <p className="mt-3 leading-7">
            APKrona har ingen funktion för kontoregistrering eller lagring av användarprofiler i denna
            kodbas. Inställningar på klientsidan, till exempel mörkt läge och filterval, sparas lokalt på
            enheten med localStorage.
          </p>
          <p className="mt-3 leading-7">
            Android-manifestet begär endast internetbehörighet, vilket krävs för att ladda appinnehåll och
            anropa API:er.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">4. Transparens kring analys och spårning</h2>
          <p className="mt-3 leading-7">
            Webbappen innehåller Microsoft Clarity-script (konfigurerat via miljövariabler) för
            användningsanalys. Detta används för att förstå användningsmönster och förbättra
            appupplevelsen.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">5. AI-funktioner och tydlig information</h2>
          <p className="mt-3 leading-7">
            APKrona erbjuder valfria AI-funktioner, exempelvis mat- och dryckesförslag samt partyplanering,
            via Google Gemini-API:er i projektet. Text som användaren skriver i dessa funktioner skickas
            till AI-leverantören för att generera svar.
          </p>
          <p className="mt-3 leading-7">
            AI-genererat innehåll kan vara ofullständigt eller felaktigt och ska ses som vägledning, inte
            som garanterat korrekt rådgivning.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">6. Säkerhet och skydd mot missbruk</h2>
          <p className="mt-3 leading-7">
            API-rutter använder origin-kontroller i CORS-hanteringen för att endast tillåta anrop från
            godkända webb- och Capacitor-origins. Interna rutter för scraping är blockerade i
            produktionsläge.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">7. Åtagande mot vilseledande beteende</h2>
          <p className="mt-3 leading-7">
            Vi åtar oss att inte dölja appfunktionalitet, inte felaktigt beskriva datakällor och inte
            använda vilseledande påståenden om prestanda, priser eller produktutfall.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">8. Uppdateringar av policyn</h2>
          <p className="mt-3 leading-7">
            Denna policy kan uppdateras när appens funktion, dataflöden eller plattformskrav ändras.
            Väsentliga ändringar publiceras på denna sida.
          </p>
        </section>
      </article>
    </main>
  );
}