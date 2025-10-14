<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FormSubmission;
use App\Models\FormSubmissionPayload;
use Illuminate\Support\Facades\Validator;

class FormSubmissionController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/survey",
     *     summary="Submit survey data",
     *     description="Endpoint untuk menerima hasil survey dari frontend",
     *     tags={"Survey"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             example={
     *                 "form_id": 1,
     *                 "form_version_id": 2,
     *                 "user_id": 5,
     *                 "answers": {
     *                     {"question_id": "Q1", "answer": "Yes"},
     *                     {"question_id": "Q2", "answer": "No"}
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Survey data stored successfully",
     *         @OA\JsonContent(
     *             example={"message": "Survey data saved", "submission_id": 10}
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_id' => 'required|integer',
            'form_version_id' => 'required|integer',
            'user_id' => 'required|integer',
            'answers' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $submission = FormSubmission::create([
            'form_id' => $request->form_id,
            'form_version_id' => $request->form_version_id,
            'user_id' => $request->user_id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        FormSubmissionPayload::create([
            'submission_id' => $submission->id,
            'answers_json' => json_encode($request->answers),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Survey data saved',
            'submission_id' => $submission->id
        ], 200);
    }
}
