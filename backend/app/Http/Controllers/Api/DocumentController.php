<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\DossierStatusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function __construct(private DossierStatusService $statusService) {}

    /**
     * Pèlerin voit ses documents.
     */
    public function index(Request $request)
    {
        $pelerin = $request->user()->pelerin;
        $inscription = $pelerin?->inscriptionActive;

        if (!$inscription) {
            return response()->json(['documents' => [], 'types_requis' => []]);
        }

        $typesRequis = $inscription->forfait->typesDocuments;
        $documents = $pelerin->documents()->with('typeDocument')->get();

        return response()->json([
            'types_requis' => $typesRequis,
            'documents'    => $documents,
        ]);
    }

    /**
     * Pèlerin téléverse un document.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type_document_id' => 'required|exists:types_documents,id',
            'fichier'          => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // max 5 Mo
        ]);

        $pelerin = $request->user()->pelerin;
        if (!$pelerin) {
            return response()->json(['message' => 'Profil pèlerin introuvable.'], 404);
        }

        // Stocker hors racine publique
        $fichier = $request->file('fichier');
        $nomUnique = 'doc_' . $pelerin->id . '_' . Str::random(16) . '.' . $fichier->getClientOriginalExtension();
        $chemin = $fichier->storeAs('documents/' . $pelerin->id, $nomUnique, 'local');

        // Mettre à jour si déjà soumis (re-téléversement après rejet)
        $document = Document::updateOrCreate(
            ['pelerin_id' => $pelerin->id, 'type_document_id' => $request->type_document_id],
            [
                'nom_fichier'   => $fichier->getClientOriginalName(),
                'chemin_fichier' => $chemin,
                'statut'        => 'soumis',
                'commentaire'   => null,
                'verifie_par'   => null,
                'date_verification' => null,
            ]
        );

        // RG3 : recalculer statut
        $inscription = $pelerin->inscriptionActive;
        if ($inscription) {
            $this->statusService->appliquer($inscription);
        }

        return response()->json([
            'message'  => 'Document téléversé avec succès.',
            'document' => $document->load('typeDocument'),
        ], 201);
    }

    /**
     * Téléchargement sécurisé (pèlerin voit son propre fichier).
     */
    public function download(Request $request, Document $document)
    {
        $pelerin = $request->user()->pelerin;
        if ($document->pelerin_id !== $pelerin?->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $this->streamDocument($document);
    }

    /**
     * Agent/Admin : liste les documents en attente de vérification.
     */
    public function adminIndex(Request $request)
    {
        $query = Document::with(['pelerin.user', 'typeDocument', 'verifieParUser'])->latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Agent vérifie un document (accepte ou rejette).
     */
    public function verifier(Request $request, Document $document)
    {
        $data = $request->validate([
            'statut'     => 'required|in:valide,rejete',
            'commentaire' => 'nullable|required_if:statut,rejete|string|max:500',
        ]);

        $document->update(array_merge($data, [
            'verifie_par'       => $request->user()->id,
            'date_verification' => now(),
        ]));

        // RG3 : recalculer statut du dossier
        $inscription = $document->pelerin->inscriptionActive;
        if ($inscription) {
            $this->statusService->appliquer($inscription);
        }

        return response()->json([
            'message'  => 'Document ' . ($data['statut'] === 'valide' ? 'validé' : 'rejeté') . '.',
            'document' => $document->fresh(['typeDocument', 'verifieParUser']),
        ]);
    }

    /**
     * Admin/Agent télécharge le fichier d'un pèlerin.
     */
    public function adminDownload(Request $request, Document $document)
    {
        return $this->streamDocument($document);
    }

    private function streamDocument(Document $document)
    {
        if (!Storage::disk('local')->exists($document->chemin_fichier)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        return Storage::disk('local')->download(
            $document->chemin_fichier,
            $document->nom_fichier
        );
    }
}
