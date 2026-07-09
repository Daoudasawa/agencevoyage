<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Pelerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Export CSV des pelerins.
     */
    public function pelerins(Request $request)
    {
        $query = Pelerin::with(['user', 'inscriptionActive.forfait', 'groupe', 'paiements']);

        if ($request->filled('search')) {
            $query->whereHas('user', fn($q) =>
                $q->where('nom', 'like', '%'.$request->search.'%')
                  ->orWhere('prenom', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%')
            );
        }

        if ($request->filled('groupe_id')) {
            $query->where('groupe_id', $request->groupe_id);
        }

        if ($request->filled('statut')) {
            $query->whereHas('inscriptionActive', fn($q) =>
                $q->where('statut', $request->statut)
            );
        }

        if ($request->filled('forfait_type')) {
            $query->whereHas('inscriptionActive.forfait', fn($q) =>
                $q->where('type', $request->forfait_type)
            );
        }

        $handle = fopen('php://temp', 'r+');
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, ['Nom', 'Prenom', 'Email', 'Telephone', 'Passeport', 'Nationalite', 'Forfait', 'Statut', 'Groupe', 'Total Paye (FCFA)']);

        foreach ($query->latest()->get() as $pelerin) {
            $inscription = $pelerin->inscriptionActive;

            fputcsv($handle, [
                $pelerin->user->nom,
                $pelerin->user->prenom,
                $pelerin->user->email,
                $pelerin->telephone ?? '',
                $pelerin->numero_passeport ?? '',
                $pelerin->nationalite,
                $inscription?->forfait->nom ?? '',
                $inscription?->statut ?? '',
                $pelerin->groupe?->nom ?? 'Non affecte',
                $pelerin->getTotalPaye(),
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return Response::make($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="pelerins_export.csv"',
        ]);
    }

    /**
     * Export CSV des paiements.
     */
    public function paiements(Request $request)
    {
        $query = Paiement::with(['pelerin.user'])->latest();

        if ($request->filled('date_debut')) {
            $query->where('date_paiement', '>=', $request->date_debut);
        }
        if ($request->filled('date_fin')) {
            $query->where('date_paiement', '<=', $request->date_fin);
        }

        $handle = fopen('php://temp', 'r+');
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, ['Date', 'Pelerin', 'Montant (FCFA)', 'Mode', 'Reference', 'Statut']);

        foreach ($query->get() as $paiement) {
            fputcsv($handle, [
                $paiement->date_paiement,
                $paiement->pelerin->user->nom.' '.$paiement->pelerin->user->prenom,
                $paiement->montant,
                $paiement->mode_paiement,
                $paiement->reference ?? '',
                $paiement->statut,
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return Response::make($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="paiements_export.csv"',
        ]);
    }
}
