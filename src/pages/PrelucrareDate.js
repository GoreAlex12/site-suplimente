import React from "react";

const sections = [
  {
    title: "1. Operatorul datelor cu caracter personal",
    body: `S.C. Suplimente Naturale S.R.L., cu sediul in Bucuresti, Romania, inregistrata la Registrul Comertului sub nr. J40/1234/2020, CUI RO12345678, prelucreaza datele dumneavoastra cu caracter personal in conformitate cu Regulamentul (UE) 2016/679 (GDPR) si cu legislatia nationala in vigoare.

Contact responsabil protectia datelor: contact@suplimente.ro`,
  },
  {
    title: "2. Ce date personale colectam",
    body: `In functie de modul in care interactionati cu site-ul nostru, putem colecta urmatoarele categorii de date:

• Date de identificare: nume, prenume
• Date de contact: adresa de email, numar de telefon, adresa de livrare
• Date legate de tranzactii: produsele comandate, valoarea comenzilor, istoricul cumparaturilor
• Date tehnice: adresa IP, tipul de browser, sistemul de operare, cookie-uri
• Date furnizate voluntar prin formularul de contact`,
  },
  {
    title: "3. Scopurile prelucrarii",
    body: `Prelucram datele dumneavoastra personale in urmatoarele scopuri:

• Procesarea si livrarea comenzilor
• Comunicarea cu dumneavoastra privind comenzile si solicitarile
• Imbunatatirea serviciilor si a experientei pe site
• Trimiterea de comunicari comerciale (doar cu acordul dumneavoastra explicit)
• Indeplinirea obligatiilor legale (facturare, contabilitate, raportari fiscale)
• Prevenirea si detectarea fraudelor`,
  },
  {
    title: "4. Temeiul juridic al prelucrarii",
    body: `Prelucram datele dumneavoastra pe baza urmatoarelor temeiuri juridice:

• Executarea contractului — pentru procesarea comenzilor si livrarea produselor
• Consimtamantul — pentru trimiterea newsletter-ului si a comunicarilor de marketing
• Interesul legitim — pentru imbunatatirea serviciilor si securitatea site-ului
• Obligatia legala — pentru indeplinirea obligatiilor fiscale si contabile`,
  },
  {
    title: "5. Durata pastrarii datelor",
    body: `Datele dumneavoastra personale sunt pastrate doar pe durata necesara indeplinirii scopurilor pentru care au fost colectate:

• Datele legate de comenzi: 5 ani de la ultima comanda (conform legislatiei fiscale)
• Datele contului de client: pana la solicitarea stergerii contului
• Datele de marketing: pana la retragerea consimtamantului
• Cookie-urile: conform duratei specificate in politica de cookie-uri`,
  },
  {
    title: "6. Drepturile dumneavoastra",
    body: `In conformitate cu GDPR, aveti urmatoarele drepturi:

• Dreptul de acces — puteti solicita informatii despre datele pe care le detinem
• Dreptul la rectificare — puteti solicita corectarea datelor inexacte
• Dreptul la stergere — puteti solicita stergerea datelor, in anumite conditii
• Dreptul la restrictionarea prelucrarii
• Dreptul la portabilitatea datelor
• Dreptul de opozitie la prelucrare
• Dreptul de a nu fi supus unei decizii individuale automatizate
• Dreptul de a depune plangere la ANSPDCP (Autoritatea Nationala de Supraveghere a Prelucrarii Datelor cu Caracter Personal)

Pentru exercitarea acestor drepturi, va rugam sa ne contactati la contact@suplimente.ro.`,
  },
  {
    title: "7. Securitatea datelor",
    body: `Implementam masuri tehnice si organizatorice adecvate pentru a proteja datele dumneavoastra impotriva accesului neautorizat, pierderii sau distrugerii. Conexiunile cu site-ul nostru sunt protejate prin protocol SSL (HTTPS).`,
  },
  {
    title: "8. Transferul datelor catre terti",
    body: `Nu vindem, nu inchiriem si nu divulgam datele dumneavoastra personale catre terti, cu exceptia:

• Furnizorilor de servicii de curierat — pentru livrarea comenzilor
• Procesatorilor de plati — pentru procesarea platilor online
• Autoritatilor publice — atunci cand legislatia ne obliga
• Furnizorilor de servicii IT — pentru mentinerea si securitatea platformei

Toti partenerii nostri sunt obligati contractual sa protejeze datele dumneavoastra conform GDPR.`,
  },
  {
    title: "9. Modificari ale politicii",
    body: `Ne rezervam dreptul de a modifica aceasta politica de prelucrare a datelor personale. Orice modificare va fi publicata pe aceasta pagina cu data ultimei actualizari.`,
  },
];

const PrelucrareDate = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
        Prelucrare date personale
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        Ultima actualizare: 1 aprilie 2026
      </p>

      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PrelucrareDate;
