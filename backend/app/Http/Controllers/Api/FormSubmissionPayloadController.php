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
     *     summary="Get submission payload by submission ID",
     *     tags={"Form Submission Payloads"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         description="Submission ID (24-character hexadecimal MongoDB ObjectId)",
     *         required=true,
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid submission ID format",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid submission ID format")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Payload not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Payload not found")
     *         )
     *     )
     * )
     */
    public function show($submissionId)
    {
        if (!preg_match('/^[a-f0-9]{24}$/', $submissionId)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid submission ID format'
            ], 400);
        }

        $payload = FormSubmissionPayload::where('submission_id', $submissionId)
            ->with('submission:_id,form_id,submitted_by,status')
            ->first();

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Payload not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payload
        ], 200);
    }
}
