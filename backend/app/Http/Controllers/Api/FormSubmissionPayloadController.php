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
     *     description="Retrieve payload data for a specific submission",
     *     tags={"Form Submission Payloads"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="submissionId",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the submission",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="Submission payload details"),
     *     @OA\Response(response=404, description="Payload not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
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

        return response()->json($payload, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/payloads/{id}",
     *     summary="Get payload by ID",
     *     description="Retrieve a specific payload by its ID",
     *     tags={"Form Submission Payloads"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="Payload details"),
     *     @OA\Response(response=404, description="Payload not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
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

        return response()->json($payload, 200);
    }
}
