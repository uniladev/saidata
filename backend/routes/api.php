<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\FormSubmissionController;
use App\Http\Controllers\Api\FormSubmissionPayloadController;
use App\Http\Controllers\Api\UserProfileController;

Route::prefix('v1')->group(function () {
    
    // Authentication routes
    Route::prefix('auth')->group(function () {
        // Public routes
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        
        // Protected routes
        Route::middleware('auth:api')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // Protected API routes
    Route::middleware('auth:api')->group(function () {
        
        // Forms routes - Only MongoDB ObjectId
        Route::prefix('forms')->group(function () {
            Route::get('/', [FormController::class, 'index']);
            Route::post('/', [FormController::class, 'store']);
            Route::get('/{id}', [FormController::class, 'show'])
                ->where('id', '[a-f0-9]{24}');
            Route::put('/{id}', [FormController::class, 'update'])
                ->where('id', '[a-f0-9]{24}');
            Route::delete('/{id}', [FormController::class, 'destroy'])
                ->where('id', '[a-f0-9]{24}');
        });

        // Survey submission route
        Route::post('/survey', [FormSubmissionController::class, 'store']);

        // Submission payloads routes
        Route::prefix('submissions')->group(function () {
            Route::get('/{submissionId}/payload', [FormSubmissionPayloadController::class, 'show'])
                ->where('submissionId', '[a-f0-9]{24}');
        });

        Route::prefix('payloads')->group(function () {
            Route::get('/{id}', [FormSubmissionPayloadController::class, 'showById'])
                ->where('id', '[a-f0-9]{24}');
        });

        // User profiles routes
        Route::prefix('users')->group(function () {
            Route::get('/{userId}/profile', [UserProfileController::class, 'show'])
                ->where('userId', '[a-f0-9]{24}');
        });

        Route::prefix('user-profiles')->group(function () {
            Route::post('/', [UserProfileController::class, 'store']);
            Route::put('/{id}', [UserProfileController::class, 'update'])
                ->where('id', '[a-f0-9]{24}');
            Route::delete('/{id}', [UserProfileController::class, 'destroy'])
                ->where('id', '[a-f0-9]{24}');
        });
    });
});