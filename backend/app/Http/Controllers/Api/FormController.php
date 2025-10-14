<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/forms",
     *     summary="Get all forms",
     *     description="Retrieve all forms",
     *     tags={"Forms"},
     *     @OA\Response(
     *         response=200,
     *         description="List of forms",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 example={
     *                     "id": 1,
     *                     "title": "Customer Satisfaction Survey",
     *                     "description": "Survey to measure customer satisfaction",
     *                     "status": "active",
     *                     "created_at": "2025-10-14T10:00:00.000000Z",
     *                     "updated_at": "2025-10-14T10:00:00.000000Z"
     *                 }
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $forms = Form::all();
        return response()->json($forms, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/forms/{id}",
     *     summary="Get form by ID",
     *     description="Retrieve a specific form by ID",
     *     tags={"Forms"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form details",
     *         @OA\JsonContent(
     *             type="object",
     *             example={
     *                 "id": 1,
     *                 "title": "Customer Satisfaction Survey",
     *                 "description": "Survey to measure customer satisfaction",
     *                 "status": "active",
     *                 "created_at": "2025-10-14T10:00:00.000000Z",
     *                 "updated_at": "2025-10-14T10:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     )
     * )
     */
    public function show($id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }

        return response()->json($form, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/forms",
     *     summary="Create new form",
     *     description="Create a new form",
     *     tags={"Forms"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *             @OA\Property(property="description", type="string", example="Survey to measure customer satisfaction"),
     *             @OA\Property(property="status", type="string", enum={"draft", "active", "inactive"}, example="draft")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Form created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             example={
     *                 "message": "Form created successfully",
     *                 "form": {
     *                     "id": 1,
     *                     "title": "Customer Satisfaction Survey",
     *                     "description": "Survey to measure customer satisfaction",
     *                     "status": "draft"
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $form = Form::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json([
            'message' => 'Form created successfully',
            'form' => $form
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/forms/{id}",
     *     summary="Update form",
     *     description="Update an existing form",
     *     tags={"Forms"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="title", type="string", example="Updated Survey Title"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="status", type="string", enum={"draft", "active", "inactive"}, example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $form->update($request->only(['title', 'description', 'status']));

        return response()->json([
            'message' => 'Form updated successfully',
            'form' => $form
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/forms/{id}",
     *     summary="Delete form",
     *     description="Delete a form",
     *     tags={"Forms"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }

        $form->delete();

        return response()->json([
            'message' => 'Form deleted successfully'
        ], 200);
    }
}
