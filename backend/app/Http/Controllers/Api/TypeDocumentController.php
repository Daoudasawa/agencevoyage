<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forfait;
use App\Models\TypeDocument;
use Illuminate\Http\Request;

class TypeDocumentController extends Controller
{
    public function store(Request $request, Forfait $forfait)
    {
        $data = $request->validate([
            'nom'         => 'required|string|max:200',
            'obligatoire' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $type = TypeDocument::create(array_merge($data, ['forfait_id' => $forfait->id]));
        return response()->json($type, 201);
    }

    public function update(Request $request, TypeDocument $typeDocument)
    {
        $data = $request->validate([
            'nom'         => 'sometimes|string|max:200',
            'obligatoire' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $typeDocument->update($data);
        return response()->json($typeDocument);
    }

    public function destroy(TypeDocument $typeDocument)
    {
        $typeDocument->delete();
        return response()->json(['message' => 'Type de document supprimé.']);
    }
}
