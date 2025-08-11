import React from 'react';

// Placeholder dashboard component for usage analytics.
// This component can later be expanded to display actual metrics
// such as posts created, engagement, and usage statistics.
export default function UsageDashboard() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Käyttöraportit</h2>
      <p>Tervetuloa käyttöraporttinäkymään! Tähän näkymään tulee jatkossa näkyville Gunvald-alustan käyttöön liittyviä tilastoja ja tunnuslukuja.</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Tulossa: julkaistujen ja ajastettujen postausten määrä per viikko.</li>
        <li>Tulossa: aiheen ja hashtagin mukaan jaoteltu top-postaukset.</li>
        <li>Tulossa: käyttäjäkohtaisten suunnitelmien tehokkuus ja käyttötaso.</li>
      </ul>
      <p className="italic text-gray-500">(Tämä on toistaiseksi placeholder-komponentti – datanäkymä päivittyy, kun analytiikka-integraatio on valmis.)</p>
    </div>
  );
}
