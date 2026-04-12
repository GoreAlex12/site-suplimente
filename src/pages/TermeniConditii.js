import React from "react";

const sections = [
  {
    title: "1. Informatii generale",
    body: `Prezentul document stabileste termenii si conditiile generale de utilizare a site-ului si de achizitionare a produselor comercializate prin intermediul magazinului online. Prin accesarea si utilizarea site-ului, confirmati ca ati citit, inteles si acceptat acesti termeni si conditii in integralitate.

Operatorul site-ului este S.C. Suplimente Naturale S.R.L., cu sediul in Bucuresti, Romania, inregistrata la Registrul Comertului sub nr. J40/1234/2020, CUI RO12345678.`,
  },
  {
    title: "2. Definitii",
    body: `• „Client" – orice persoana fizica sau juridica care efectueaza o comanda prin intermediul site-ului.
• „Produs" – orice supliment alimentar, produs naturist sau accesoriu disponibil spre vanzare pe site.
• „Comanda" – solicitarea de achizitionare a unuia sau mai multor produse, transmisa prin intermediul site-ului.
• „Contract" – acordul dintre Operator si Client, materializat prin confirmarea comenzii.`,
  },
  {
    title: "3. Inregistrarea comenzilor",
    body: `Comenzile pot fi plasate 24 de ore din 24, 7 zile din 7. Dupa plasarea unei comenzi, veti primi un email de confirmare cu detaliile comenzii. Confirmarea comenzii de catre Operator reprezinta incheierea contractului de vanzare la distanta.

Ne rezervam dreptul de a refuza sau anula orice comanda in cazul in care produsele nu sunt disponibile in stoc sau datele furnizate sunt incomplete sau incorecte.`,
  },
  {
    title: "4. Preturi si modalitati de plata",
    body: `Preturile afisate pe site includ TVA si sunt exprimate in lei (RON). Preturile pot fi modificate fara notificare prealabila, insa modificarile nu vor afecta comenzile deja confirmate.

Metodele de plata acceptate sunt:
• Plata ramburs la livrare
• Transfer bancar
• Plata online cu cardul (Visa, Mastercard)`,
  },
  {
    title: "5. Livrare",
    body: `Livrarea se efectueaza pe teritoriul Romaniei prin servicii de curierat. Termenul estimat de livrare este de 1-3 zile lucratoare de la confirmarea comenzii. Costul de transport este de 25 lei pentru comenzile sub 150 lei, si gratuit pentru comenzile care depasesc aceasta valoare.

Detalii suplimentare despre livrare gasiti pe pagina dedicata „Livrare si transport".`,
  },
  {
    title: "6. Dreptul de retragere",
    body: `Conform OUG 34/2014, aveti dreptul de a va retrage din contract in termen de 14 zile calendaristice de la primirea produselor, fara a indica un motiv. Produsele trebuie returnate in ambalajul original, nedesfacute si in stare perfecta. Costurile de returnare sunt suportate de Client.

Rambursarea sumei platite se va efectua in termen de 14 zile de la primirea produselor returnate, prin aceeasi metoda de plata utilizata la achizitie.`,
  },
  {
    title: "7. Garantii si reclamatii",
    body: `Toate produsele comercializate sunt originale si provin de la producatori autorizati. In cazul in care primiti un produs deteriorat sau diferit de cel comandat, va rugam sa ne contactati in termen de 48 de ore de la primirea coletului.

Reclamatiile pot fi trimise pe email la contact@suplimente.ro sau telefonic la 0772 027 622.`,
  },
  {
    title: "8. Raspundere",
    body: `Suplimentele alimentare nu sunt medicamente si nu inlocuiesc un regim alimentar variat si echilibrat. Consultati un medic inainte de a incepe orice cura de suplimente, in special daca sunteti insarcinata, alaptati sau luati medicamente.

Operatorul nu isi asuma raspunderea pentru utilizarea necorespunzatoare a produselor sau pentru nerespectarea dozajului recomandat de producator.`,
  },
  {
    title: "9. Forta majora",
    body: `Niciuna dintre parti nu va fi raspunzatoare pentru neexecutarea obligatiilor contractuale daca aceasta a fost determinata de un eveniment de forta majora, asa cum este definit de legislatia romana in vigoare.`,
  },
  {
    title: "10. Litigii",
    body: `Prezentul contract este supus legislatiei romane. In cazul unor litigii, partile vor incerca solutionarea amiabila. In cazul in care nu se ajunge la un acord, litigiile vor fi solutionate de instantele competente din Bucuresti.`,
  },
];

const TermeniConditii = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
        Termeni si conditii
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

export default TermeniConditii;
