<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\FormSubmissionPayload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class FormSubmissionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/forms/{formId}/submissions",
     *     summary="Get all submissions for a form",
     *     description="Retrieve all submissions for a specific form with submitter details",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="formId",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the form (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of submissions",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b5678"),
     *                     @OA\Property(property="form_id", type="string", example="671292eb4c6b7a0d4e0b1234"),
     *                     @OA\Property(property="form_version", type="integer", example=1),
     *                     @OA\Property(property="form_title", type="string", example="Customer Satisfaction Survey"),
     *                     @OA\Property(property="submitted_by", type="string", example="671292eb4c6b7a0d4e0b9999"),
     *                     @OA\Property(property="status", type="string", enum={"completed", "draft"}, example="completed"),
     *                     @OA\Property(
     *                         property="submitter",
     *                         type="object",
     *                         @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b9999"),
     *                         @OA\Property(property="name", type="string", example="John Doe"),
     *                         @OA\Property(property="email", type="string", example="john@example.com")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-20T10:30:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-10-20T10:30:00.000000Z")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid form ID format",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid form ID format")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index($formId)
    {
        // Validate ObjectId format
        if (!preg_match('/^[a-f0-9]{24}$/', $formId)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid form ID format'
            ], 400);
        }

        // Check if form exists
        $form = Form::find($formId);
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Build query based on user role
        $query = FormSubmission::where('form_id', $formId);

        // If not admin, only show user's own submissions
        if ($user->role !== 'admin') {
            $query->where('submitted_by', $user->_id);
        }

        $submissions = $query
            ->with(['submitter:_id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $submissions
        ], 200);
    }
    /**
     * @OA\Get(
     *     path="/api/v1/submissions/{id}",
     *     summary="Get submission by ID with payload",
     *     description="Retrieve a specific submission with its payload, form details, and submitter information",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the submission (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b5678")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Submission details with payload",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b5678"),
     *                 @OA\Property(property="form_id", type="string", example="671292eb4c6b7a0d4e0b1234"),
     *                 @OA\Property(property="form_version", type="integer", example=1),
     *                 @OA\Property(property="form_title", type="string", example="Customer Satisfaction Survey"),
     *                 @OA\Property(property="submitted_by", type="string", example="671292eb4c6b7a0d4e0b9999"),
     *                 @OA\Property(property="status", type="string", enum={"completed", "draft"}, example="completed"),
     *                 @OA\Property(
     *                     property="form",
     *                     type="object",
     *                     @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b1234"),
     *                     @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *                     @OA\Property(property="slug", type="string", example="customer-satisfaction-survey"),
     *                     @OA\Property(property="version", type="integer", example=1)
     *                 ),
     *                 @OA\Property(
     *                     property="submitter",
     *                     type="object",
     *                     @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b9999"),
     *                     @OA\Property(property="name", type="string", example="John Doe"),
     *                     @OA\Property(property="email", type="string", example="john@example.com")
     *                 ),
     *                 @OA\Property(
     *                     property="payload",
     *                     type="object",
     *                     @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0baaaa"),
     *                     @OA\Property(property="submission_id", type="string", example="671292eb4c6b7a0d4e0b5678"),
     *                     @OA\Property(
     *                         property="answers",
     *                         type="object",
     *                         example={"question1": "Very satisfied", "question2": 5}
     *                     )
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-10-20T10:30:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-10-20T10:30:00.000000Z")
     *             )
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
     *         description="Submission not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Submission not found")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function show($id)
    {
        // Validate ObjectId format
        if (!preg_match('/^[a-f0-9]{24}$/', $id)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid submission ID format'
            ], 400);
        }

        $submission = FormSubmission::with([
            'submitter:_id,name,email',
            'form:_id,title,slug,version',
            'payload'
        ])->find($id);

        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Submission not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $submission
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/forms/{formId}/submit",
     *     summary="Submit Form response",
     *     description="Submit a new response to a form. Creates both submission record and payload.",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="formId",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the form (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"answers"},
     *             @OA\Property(
     *                 property="answers",
     *                 type="object",
     *                 description="Key-value pairs of field IDs and their answers",
     *                 example={
     *                     "field_1": "Very satisfied",
     *                     "field_2": 5,
     *                     "field_3": {"option1", "option2"}
     *                 }
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"completed", "draft"},
     *                 description="Submission status (default: completed)",
     *                 example="completed"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Form submitted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Form submitted successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b5678"),
     *                 @OA\Property(property="form_id", type="string", example="671292eb4c6b7a0d4e0b1234"),
     *                 @OA\Property(property="form_version", type="integer", example=1),
     *                 @OA\Property(property="form_title", type="string", example="Customer Satisfaction Survey"),
     *                 @OA\Property(property="submitted_by", type="string", example="671292eb4c6b7a0d4e0b9999"),
     *                 @OA\Property(property="status", type="string", example="completed"),
     *                 @OA\Property(
     *                     property="submitter",
     *                     type="object",
     *                     @OA\Property(property="_id", type="string"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string")
     *                 ),
     *                 @OA\Property(
     *                     property="payload",
     *                     type="object",
     *                     @OA\Property(property="_id", type="string"),
     *                     @OA\Property(property="submission_id", type="string"),
     *                     @OA\Property(property="answers", type="object")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid form ID format",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid form ID format")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Form is no longer active",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="This form is no longer active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Form not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="answers", type="array", @OA\Items(type="string", example="The answers field is required."))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Failed to submit form"),
     *             @OA\Property(property="error", type="string", example="Database connection error")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request, $formId)
    {
        // Validate ObjectId format
        if (!preg_match('/^[a-f0-9]{24}$/', $formId)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid form ID format'
            ], 400);
        }

        // Check if form exists
        $form = Form::find($formId);
        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        // Only allow submissions to active forms
        if (!$form->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This form is no longer active'
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'status' => 'nullable|in:completed,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
                $user = JWTAuth::parseToken()->authenticate();

                // Create submission with minimal snapshot
                $submission = FormSubmission::create([
                    'form_id' => $formId,
                    'form_version' => $form->version ?? 1, // Store version
                    'form_title' => $form->title, // Store title for display
                    'submitted_by' => $user->_id,
                    'status' => $request->input('status', 'completed'),
                ]);

                // Create payload
                FormSubmissionPayload::create([
                    'submission_id' => $submission->_id,
                    'answers' => $request->input('answers'),
                ]);
            

            // Load relationships for response
            $submission->load(['submitter:_id,name,email', 'payload']);

            return response()->json([
                'success' => true,
                'message' => 'Form submitted successfully',
                'data' => $submission
            ], 201);

        } catch (\Exception $e) {
            if (isset($submission)) {
                $submission->delete();
            }
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/submissions/{id}",
     *     summary="Update submission (draft only)",
     *     description="Update a draft submission. Completed submissions cannot be updated.",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the submission (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b5678")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="answers",
     *                 type="object",
     *                 description="Updated answers (optional)",
     *                 example={"field_1": "Updated answer", "field_2": 4}
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="string",
     *                 enum={"completed", "draft"},
     *                 description="Updated status (optional)",
     *                 example="completed"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Submission updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Submission updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="_id", type="string"),
     *                 @OA\Property(property="form_id", type="string"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="submitter", type="object"),
     *                 @OA\Property(property="payload", type="object")
     *             )
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
     *         response=403,
     *         description="Cannot update completed submission",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Cannot update completed submission")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Submission not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Submission not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function update(Request $request, $id)
    {
        if (!preg_match('/^[a-f0-9]{24}$/', $id)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid submission ID format'
            ], 400);
        }

        $submission = FormSubmission::find($id);

        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Submission not found'
            ], 404);
        }

        // Only allow updating drafts
        if ($submission->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update completed submission'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'answers' => 'nullable|array',
            'status' => 'nullable|in:completed,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
                $submission->update([
                    'status' => $request->input('status', $submission->status),
                ]);

                if ($request->has('answers')) {
                    $payload = FormSubmissionPayload::where('submission_id', $submission->_id)->first();
                    if ($payload) {
                        $payload->update(['answers' => $request->input('answers')]);
                    }
                }

            $submission->load(['submitter:_id,name,email', 'payload']);

            return response()->json([
                'success' => true,
                'message' => 'Submission updated successfully',
                'data' => $submission
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update submission',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/submissions/{id}",
     *     summary="Delete submission",
     *     description="Delete a submission and its associated payload",
     *     tags={"Form Submissions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the submission (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b5678")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Submission deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Submission deleted successfully")
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
     *         description="Submission not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Submission not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Failed to delete submission"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function destroy($id)
    {
        if (!preg_match('/^[a-f0-9]{24}$/', $id)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid submission ID format'
            ], 400);
        }

        $submission = FormSubmission::find($id);

        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Submission not found'
            ], 404);
        }

        try {
                // Delete payload first
                FormSubmissionPayload::where('submission_id', $submission->_id)->delete();
                // Delete submission
                $submission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Submission deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete submission',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
