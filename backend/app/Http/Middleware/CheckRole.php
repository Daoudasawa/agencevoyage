<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Vérifie que l'utilisateur authentifié a l'un des rôles requis.
     * Usage : Route::middleware('role:admin,agent')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès non autorisé. Rôle requis : ' . implode(' ou ', $roles),
                'error' => 'FORBIDDEN',
            ], 403);
        }

        return $next($request);
    }
}
