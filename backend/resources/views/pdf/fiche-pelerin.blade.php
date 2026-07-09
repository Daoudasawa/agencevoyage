<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Fiche Pèlerin — {{ $pelerin->user->nom }} {{ $pelerin->user->prenom }}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #222; background: #fff; }
  .page { padding: 36px; }

  .header { background: #0d3b1e; color: #fff; padding: 20px 28px; border-radius: 6px; margin-bottom: 24px; }
  .header-row { display: table; width: 100%; }
  .header-left { display: table-cell; vertical-align: middle; }
  .header-right { display: table-cell; vertical-align: middle; text-align: right; }
  .header h1 { font-size: 18px; font-weight: bold; }
  .header p { font-size: 10px; opacity: 0.75; }
  .badge { background: #f59e0b; color: #fff; font-size: 11px; font-weight: bold; padding: 5px 14px; border-radius: 4px; letter-spacing: 1px; }

  h2 { font-size: 13px; color: #0d3b1e; border-bottom: 2px solid #0d3b1e; padding-bottom: 5px; margin-bottom: 12px; margin-top: 20px; }

  .two-col { display: table; width: 100%; margin-bottom: 4px; }
  .col-left { display: table-cell; width: 50%; padding-right: 12px; vertical-align: top; }
  .col-right { display: table-cell; width: 50%; vertical-align: top; }

  table.info { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.info td { padding: 7px 10px; border: 1px solid #e2e8f0; font-size: 11px; }
  table.info td:first-child { background: #f1f5f9; color: #475569; font-weight: bold; width: 40%; }
  table.info td:last-child { color: #1e293b; }

  table.docs { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.docs th { background: #0d3b1e; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  table.docs td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
  table.docs tr:nth-child(even) td { background: #f8fafc; }

  table.paiements { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.paiements th { background: #0d3b1e; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
  table.paiements td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
  table.paiements tr:nth-child(even) td { background: #f8fafc; }
  .total-row td { background: #f0fdf4 !important; font-weight: bold; color: #166534; }

  .badge-statut { padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; }
  .badge-valide { background: #dcfce7; color: #166534; }
  .badge-soumis { background: #dbeafe; color: #1e40af; }
  .badge-rejete { background: #fee2e2; color: #991b1b; }
  .badge-attente { background: #fef9c3; color: #854d0e; }
  .badge-annule { background: #f1f5f9; color: #64748b; }

  .statut-dossier { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  .statut-incomplet { background: #fef9c3; color: #854d0e; }
  .statut-en_verification { background: #dbeafe; color: #1e40af; }
  .statut-valide { background: #dcfce7; color: #166534; }
  .statut-desiste { background: #fee2e2; color: #991b1b; }

  .footer { margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; color: #94a3b8; font-size: 9px; }
  .footer strong { color: #0d3b1e; }

  .signature-area { display: table; width: 100%; margin-top: 32px; }
  .sig-col { display: table-cell; width: 33%; text-align: center; padding: 0 10px; }
  .sig-line { border-top: 1px solid #94a3b8; margin-top: 40px; padding-top: 6px; font-size: 10px; color: #64748b; }
</style>
</head>
<body>
<div class="page">

  <!-- En-tête -->
  <div class="header">
    <div class="header-row">
      <div class="header-left">
        <h1>🕌 Hajj & Omra BF</h1>
        <p>Agence de Voyage — Burkina Faso</p>
      </div>
      <div class="header-right">
        <div class="badge">FICHE PÈLERIN</div>
        <p style="margin-top:6px; font-size:10px;">Généré le {{ now()->format('d/m/Y') }}</p>
      </div>
    </div>
  </div>

  <!-- Identité -->
  <h2>Identité du Pèlerin</h2>
  <div class="two-col">
    <div class="col-left">
      <table class="info">
        <tr><td>Nom</td><td>{{ $pelerin->user->nom }}</td></tr>
        <tr><td>Prénom</td><td>{{ $pelerin->user->prenom }}</td></tr>
        <tr><td>Email</td><td>{{ $pelerin->user->email }}</td></tr>
        <tr><td>Téléphone</td><td>{{ $pelerin->telephone ?: '-' }}</td></tr>
        <tr><td>Nationalité</td><td>{{ $pelerin->nationalite ?: 'Burkinabè' }}</td></tr>
      </table>
    </div>
    <div class="col-right">
      <table class="info">
        <tr><td>Date de naissance</td><td>{{ $pelerin->date_naissance ? $pelerin->date_naissance->format('d/m/Y') : '-' }}</td></tr>
        <tr><td>N° Passeport</td><td>{{ $pelerin->numero_passeport ?: '-' }}</td></tr>
        <tr><td>Profession</td><td>{{ $pelerin->profession ?: '-' }}</td></tr>
        <tr><td>Adresse</td><td>{{ $pelerin->adresse ?: '-' }}</td></tr>
        <tr><td>Groupe</td><td>{{ $pelerin->groupe?->nom ?: 'Non assigné' }}</td></tr>
      </table>
    </div>
  </div>

  <!-- Inscription -->
  @if($pelerin->inscriptionActive)
  @php $ins = $pelerin->inscriptionActive; @endphp
  <h2>Dossier d'Inscription</h2>
  <table class="info">
    <tr>
      <td>Forfait</td>
      <td>{{ $ins->forfait->nom }} — <em>{{ strtoupper($ins->forfait->type) }}</em></td>
    </tr>
    <tr>
      <td>Prix du forfait</td>
      <td>{{ number_format($ins->forfait->prix, 0, ',', ' ') }} FCFA</td>
    </tr>
    <tr>
      <td>Date d'inscription</td>
      <td>{{ $ins->date_inscription->format('d/m/Y') }}</td>
    </tr>
    <tr>
      <td>Statut du dossier</td>
      <td>
        @php
          $statutLabels = ['incomplet' => 'INCOMPLET', 'en_verification' => 'EN VÉRIFICATION', 'valide' => 'VALIDÉ', 'desiste' => 'DÉSISTÉ'];
        @endphp
        <span class="statut-dossier statut-{{ $ins->statut }}">
          {{ $statutLabels[$ins->statut] ?? strtoupper($ins->statut) }}
        </span>
      </td>
    </tr>
    @if($ins->commentaire_agent)
    <tr><td>Commentaire Agent</td><td>{{ $ins->commentaire_agent }}</td></tr>
    @endif
  </table>
  @endif

  <!-- Documents -->
  <h2>Documents Fournis</h2>
  @if($pelerin->documents->isEmpty())
    <p style="color:#94a3b8; font-style:italic; margin-bottom:16px;">Aucun document soumis.</p>
  @else
  <table class="docs">
    <thead>
      <tr>
        <th>Type de Document</th>
        <th>Nom du fichier</th>
        <th>Date soumission</th>
        <th>Statut</th>
        <th>Commentaire</th>
      </tr>
    </thead>
    <tbody>
      @foreach($pelerin->documents as $doc)
      <tr>
        <td>{{ $doc->typeDocument->nom }}</td>
        <td>{{ $doc->nom_fichier }}</td>
        <td>{{ $doc->created_at->format('d/m/Y') }}</td>
        <td>
          @php $sc = ['soumis'=>'soumis','valide'=>'valide','rejete'=>'rejete']; @endphp
          <span class="badge-statut badge-{{ $sc[$doc->statut] ?? 'attente' }}">
            {{ strtoupper($doc->statut) }}
          </span>
        </td>
        <td>{{ $doc->commentaire ?: '-' }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
  @endif

  <!-- Paiements -->
  <h2>Historique des Paiements</h2>
  @php
    $totalPaye = $pelerin->paiements->where('statut','valide')->sum('montant');
    $prixForfait = $pelerin->inscriptionActive?->forfait?->prix ?? 0;
    $solde = max(0, $prixForfait - $totalPaye);
    $modes = ['especes' => 'Espèces', 'orange_money' => 'Orange Money', 'moov_money' => 'Moov Money', 'virement' => 'Virement'];
  @endphp
  @if($pelerin->paiements->isEmpty())
    <p style="color:#94a3b8; font-style:italic; margin-bottom:16px;">Aucun paiement enregistré.</p>
  @else
  <table class="paiements">
    <thead>
      <tr>
        <th>Référence</th>
        <th>Date</th>
        <th>Montant (FCFA)</th>
        <th>Mode</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      @foreach($pelerin->paiements->sortBy('date_paiement') as $p)
      <tr>
        <td>{{ $p->reference }}</td>
        <td>{{ $p->date_paiement->format('d/m/Y') }}</td>
        <td>{{ number_format($p->montant, 0, ',', ' ') }}</td>
        <td>{{ $modes[$p->mode_paiement] ?? $p->mode_paiement }}</td>
        <td>
          @php $sc2 = ['en_attente'=>'attente','valide'=>'valide','annule'=>'annule']; @endphp
          <span class="badge-statut badge-{{ $sc2[$p->statut] ?? 'attente' }}">
            {{ strtoupper(str_replace('_',' ',$p->statut)) }}
          </span>
        </td>
      </tr>
      @endforeach
      <tr class="total-row">
        <td colspan="2">TOTAL VALIDÉ</td>
        <td>{{ number_format($totalPaye, 0, ',', ' ') }}</td>
        <td colspan="2">Reste à payer : {{ number_format($solde, 0, ',', ' ') }} FCFA</td>
      </tr>
    </tbody>
  </table>
  @endif

  <!-- Signatures -->
  <div class="signature-area">
    <div class="sig-col">
      <div class="sig-line">Signature Pèlerin</div>
    </div>
    <div class="sig-col">
      <div class="sig-line">Cachet Agence</div>
    </div>
    <div class="sig-col">
      <div class="sig-line">Signature Responsable</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Fiche officielle émise par <strong>Hajj & Omra BF</strong> — {{ now()->format('d/m/Y à H:i') }}</p>
    <p>Ce document est confidentiel et ne doit pas être divulgué à des tiers.</p>
  </div>

</div>
</body>
</html>
