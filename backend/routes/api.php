<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::prefix('api')->group(function () {
    Route::prefix('v1')->group(function () {
        // authenticated user
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->middleware('auth:sanctum');

        // user routes
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::post('/', [UserController::class, 'store']);
        });
    });
});
