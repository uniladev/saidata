<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmissionPayload;
use Illuminate\Http\Request;

class FormSubmissionPayloadController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/submissions/{submissionId}/payload",
     *     summary="Get submission payload",
     *     description="Retrieve the payload (answers) for a specific submission",
     *     tags={"Submission Payloads"},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         required=true,
     *         description="Submission ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Submission payload details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="submission_id", type="integer", example=10),
     *             @OA\Property(property="answers", type="object", example={"Q1": "Yes", "Q2": "No"}),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Payload not found"
     *     )
     * )
     */
    public function show($submissionId)
    {
        $payload = FormSubmissionPayload::where('submission_id', $submissionId)->first();

        if (!$payload) {
            return response()->json([
                'message' => 'Payload not found'
            ], 404);
        }

        return response()->json([
            'id' => $payload->id,
            'submission_id' => $payload->submission_id,
            'answers' => json_decode($payload->answers_json),
            'created_at' => $payload->created_at
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/payloads/{id}",
     *     summary="Get payload by ID",
     *     description="Retrieve a specific payload by ID",
     *     tags={"Submission Payloads"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Payload ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Payload details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="submission_id", type="integer", example=10),
     *             @OA\Property(property="answers", type="object", example={"Q1": "Yes", "Q2": "No"}),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Payload not found"
     *     )
     * )
     */
    public function showById($id)
    {
        $payload = FormSubmissionPayload::find($id);

        if (!$payload) {
            return response()->json([
                'message' => 'Payload not found'
            ], 404);
        }

        return response()->json([
            'id' => $payload->id,
            'submission_id' => $payload->submission_id,
            'answers' => json_decode($payload->answers_json),
            'created_at' => $payload->created_at
        ], 200);
    }
}
