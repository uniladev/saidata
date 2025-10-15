<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormSubmissionController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/survey",
     *     summary="Submit survey response",
     *     description="Submit a response to a survey form",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"form_id", "version_id", "submitted_by"},
     *             @OA\Property(property="form_id", type="string", example="68ee4fc2754f6e95b809e492"),
     *             @OA\Property(property="version_id", type="string", example="68ee4fc2754f6e95b809e493"),
     *             @OA\Property(property="submitted_by", type="string", example="68ee3e2c5336195833053652"),
     *             @OA\Property(property="status", type="string", enum={"completed", "draft"}, example="completed")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Survey submitted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Survey submitted successfully"),
     *             @OA\Property(property="submission", type="object")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_id' => 'required|string|regex:/^[a-f0-9]{24}$/',
            'version_id' => 'required|string|regex:/^[a-f0-9]{24}$/',
            'submitted_by' => 'required|string|regex:/^[a-f0-9]{24}$/',
            'status' => 'nullable|in:completed,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $submission = FormSubmission::create($request->all());

        return response()->json([
            'message' => 'Survey submitted successfully',
            'submission' => $submission
        ], 201);
    }
}
