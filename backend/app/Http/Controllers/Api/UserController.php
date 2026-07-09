<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->orderBy('nom')->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'      => 'required|string|max:100',
            'prenom'   => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,agent',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
            'active'   => true,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nom'      => 'sometimes|string|max:100',
            'prenom'   => 'sometimes|string|max:100',
            'email'    => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8',
            'active'   => 'sometimes|boolean',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function toggleActive(User $user)
    {
        $user->update(['active' => !$user->active]);
        return response()->json([
            'message' => 'Compte ' . ($user->active ? 'activé' : 'désactivé') . '.',
            'user'    => $user,
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un administrateur.'], 422);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
