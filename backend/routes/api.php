<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\FormSubmissionController;
use App\Http\Controllers\Api\FormSubmissionPayloadController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\MenuController;

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
        
        // Menu routes
        Route::get('/menu', [MenuController::class, 'index']);
        
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
            
            // Form submissions by form ID
            Route::get('/{formId}/submissions', [FormSubmissionController::class, 'index'])
                ->where('formId', '[a-f0-9]{24}');
            
            // Submit form
            Route::post('/{formId}/submit', [FormSubmissionController::class, 'store'])
                ->where('formId', '[a-f0-9]{24}');

            // Get form by slug
            Route::get('/slug/{slug}', [FormController::class, 'showBySlug']);
        });

        // Form Submissions routes
        Route::prefix('submissions')->group(function () {
            Route::get('/{id}', [FormSubmissionController::class, 'show'])
                ->where('id', '[a-f0-9]{24}');
            Route::put('/{id}', [FormSubmissionController::class, 'update'])
                ->where('id', '[a-f0-9]{24}');
            Route::delete('/{id}', [FormSubmissionController::class, 'destroy'])
                ->where('id', '[a-f0-9]{24}');
            
            // Get payload by submission ID
            Route::get('/{submissionId}/payload', [FormSubmissionPayloadController::class, 'show'])
                ->where('submissionId', '[a-f0-9]{24}');
        });

        // Submission payloads routes (direct access)
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

        // Form versioning routes
        Route::group(['prefix' => 'forms', 'middleware' => 'auth:api'], function () {
            Route::get('/{id}/history', [FormController::class, 'history']);
            Route::get('/{id}/version/{version}', [FormController::class, 'showVersion']);
        });

        // Toggle form status
        Route::patch('forms/{id}/toggle-status', [FormController::class, 'toggleStatus']);
    });
});