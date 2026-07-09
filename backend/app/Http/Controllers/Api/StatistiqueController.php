<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Groupe;
use App\Models\Inscription;
use App\Models\Paiement;
use App\Models\Pelerin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    public function index(Request $request)
    {
        // Totaux généraux
        $totalPelerins  = Pelerin::count();
        $totalEncaisse  = Paiement::where('statut', 'valide')->sum('montant');
        $totalGroupes   = Groupe::count();
        $docsEnAttente  = Document::where('statut', 'soumis')->count();
        $paiementsEnAttente = Paiement::where('statut', 'en_attente')->count();

        // Répartition inscriptions par statut
        $parStatut = Inscription::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->get();

        // Répartition par type de forfait
        $parTypeForfait = Inscription::join('forfaits', 'inscriptions.forfait_id', '=', 'forfaits.id')
            ->select('forfaits.type', DB::raw('count(*) as total'))
            ->groupBy('forfaits.type')
            ->get();

        // Paiements validés par mois (12 derniers mois)
        $paiementsParMois = Paiement::where('statut', 'valide')
            ->where('date_paiement', '>=', now()->subMonths(12))
            ->select(
                DB::raw("to_char(date_paiement, 'YYYY-MM') as mois"),
                DB::raw('sum(montant) as total')
            )
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        // Taux de remplissage des groupes
        $groupes = Groupe::withCount('pelerins')->get()->map(fn($g) => [
            'id'              => $g->id,
            'nom'             => $g->nom,
            'capacite_max'    => $g->capacite_max,
            'pelerins_count'  => $g->pelerins_count,
            'taux_remplissage' => $g->capacite_max > 0
                ? round(($g->pelerins_count / $g->capacite_max) * 100, 1)
                : 0,
        ]);

        return response()->json([
            'totaux' => [
                'pelerins'            => $totalPelerins,
                'encaisse_fcfa'       => $totalEncaisse,
                'groupes'             => $totalGroupes,
                'docs_en_attente'     => $docsEnAttente,
                'paiements_en_attente' => $paiementsEnAttente,
            ],
            'inscriptions_par_statut'    => $parStatut,
            'inscriptions_par_forfait'   => $parTypeForfait,
            'paiements_par_mois'         => $paiementsParMois,
            'taux_remplissage_groupes'   => $groupes,
        ]);
    }
}
