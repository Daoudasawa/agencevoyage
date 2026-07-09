<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Reçu de Paiement</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; background: #fff; }
  .page { padding: 40px; }

  /* En-tête */
  .header { background: #0d3b1e; color: #fff; padding: 24px 32px; border-radius: 6px; margin-bottom: 32px; }
  .header h1 { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
  .header p { font-size: 11px; opacity: 0.8; }
  .header-right { text-align: right; }
  .header-row { display: table; width: 100%; }
  .header-left { display: table-cell; vertical-align: middle; }
  .header-right { display: table-cell; vertical-align: middle; text-align: right; }

  /* Badge REÇU */
  .badge-recu { background: #f59e0b; color: #fff; font-size: 22px; font-weight: bold; padding: 8px 20px; border-radius: 4px; letter-spacing: 2px; }

  /* Référence */
  .ref-box { border: 2px solid #0d3b1e; border-radius: 6px; padding: 14px 20px; margin-bottom: 24px; background: #f0fdf4; }
  .ref-box .ref-num { font-size: 18px; font-weight: bold; color: #0d3b1e; }
  .ref-box .ref-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; }

  /* Grille infos */
  .info-grid { display: table; width: 100%; margin-bottom: 24px; }
  .info-col { display: table-cell; width: 50%; vertical-align: top; padding-right: 16px; }
  .info-col:last-child { padding-right: 0; }
  .info-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; height: 100%; }
  .info-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .info-row { margin-bottom: 6px; }
  .info-row .label { color: #64748b; font-size: 10px; }
  .info-row .value { color: #1e293b; font-weight: bold; font-size: 12px; }

  /* Montant */
  .montant-box { background: #0d3b1e; color: #fff; border-radius: 6px; padding: 20px 24px; text-align: center; margin-bottom: 24px; }
  .montant-box .label-montant { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 8px; }
  .montant-box .montant { font-size: 32px; font-weight: bold; color: #f59e0b; }
  .montant-box .montant-sub { font-size: 11px; opacity: 0.8; margin-top: 4px; }

  /* Statut */
  .statut-valide { background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 4px; padding: 4px 12px; font-weight: bold; font-size: 11px; display: inline-block; }

  /* Footer */
  .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 10px; }
  .footer strong { color: #0d3b1e; }
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
        <p>Spécialiste du pèlerinage depuis 2010</p>
      </div>
      <div class="header-right">
        <div class="badge-recu">REÇU</div>
      </div>
    </div>
  </div>

  <!-- Référence -->
  <div class="ref-box">
    <div class="ref-label">Numéro de Référence</div>
    <div class="ref-num">{{ $paiement->reference }}</div>
  </div>

  <!-- Montant -->
  <div class="montant-box">
    <div class="label-montant">Montant Encaissé</div>
    <div class="montant">{{ number_format($paiement->montant, 0, ',', ' ') }} FCFA</div>
    <div class="montant-sub">
      Statut : <span style="font-weight:bold;">VALIDÉ ✓</span>
      &nbsp;|&nbsp;
      Validé le : {{ $paiement->valide_le ? $paiement->valide_le->format('d/m/Y à H:i') : '-' }}
    </div>
  </div>

  <!-- Infos -->
  <div class="info-grid">
    <div class="info-col">
      <div class="info-block">
        <h3>Informations Pèlerin</h3>
        <div class="info-row">
          <div class="label">Nom complet</div>
          <div class="value">{{ $paiement->pelerin->user->nom }} {{ $paiement->pelerin->user->prenom }}</div>
        </div>
        <div class="info-row">
          <div class="label">Email</div>
          <div class="value">{{ $paiement->pelerin->user->email }}</div>
        </div>
        @if($paiement->pelerin->numero_passeport)
        <div class="info-row">
          <div class="label">N° Passeport</div>
          <div class="value">{{ $paiement->pelerin->numero_passeport }}</div>
        </div>
        @endif
        @if($paiement->pelerin->telephone)
        <div class="info-row">
          <div class="label">Téléphone</div>
          <div class="value">{{ $paiement->pelerin->telephone }}</div>
        </div>
        @endif
      </div>
    </div>
    <div class="info-col">
      <div class="info-block">
        <h3>Détails du Paiement</h3>
        <div class="info-row">
          <div class="label">Date du versement</div>
          <div class="value">{{ $paiement->date_paiement->format('d/m/Y') }}</div>
        </div>
        <div class="info-row">
          <div class="label">Mode de paiement</div>
          <div class="value">
            @php
              $modes = ['especes' => 'Espèces', 'orange_money' => 'Orange Money', 'moov_money' => 'Moov Money', 'virement' => 'Virement Bancaire'];
            @endphp
            {{ $modes[$paiement->mode_paiement] ?? $paiement->mode_paiement }}
          </div>
        </div>
        <div class="info-row">
          <div class="label">Forfait</div>
          <div class="value">{{ $paiement->inscription->forfait->nom }}</div>
        </div>
        <div class="info-row">
          <div class="label">Prix total forfait</div>
          <div class="value">{{ number_format($paiement->inscription->forfait->prix, 0, ',', ' ') }} FCFA</div>
        </div>
        @if($paiement->notes)
        <div class="info-row">
          <div class="label">Notes</div>
          <div class="value">{{ $paiement->notes }}</div>
        </div>
        @endif
        @if($paiement->enregistrePar)
        <div class="info-row">
          <div class="label">Validé par</div>
          <div class="value">{{ $paiement->enregistrePar->prenom }} {{ $paiement->enregistrePar->nom }}</div>
        </div>
        @endif
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Ce document est un reçu officiel de paiement émis par <strong>Hajj & Omra BF</strong>.</p>
    <p>Généré le {{ now()->format('d/m/Y à H:i') }} | Conservez ce document comme preuve de paiement.</p>
    <p style="margin-top:6px;">Toute réclamation doit être effectuée dans les 30 jours suivant la date d'émission.</p>
  </div>

</div>
</body>
</html>
