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
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of forms",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="68ee4fc2754f6e95b809e492"),
     *                 @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *                 @OA\Property(property="description", type="string", example="Survey to measure customer satisfaction"),
     *                 @OA\Property(property="created_by", type="string", example="68ee3e2c5336195833053652"),
     *                 @OA\Property(property="is_published", type="boolean", example=false),
     *                 @OA\Property(property="current_version", type="integer", example=1),
     *                 @OA\Property(property="visibility", type="string", example="public"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
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
     *     description="Retrieve a specific form by MongoDB ObjectId",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(
     *             type="string",
     *             pattern="^[a-f0-9]{24}$",
     *             example="68ee4fc2754f6e95b809e492"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="string", example="68ee4fc2754f6e95b809e492"),
     *             @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *             @OA\Property(property="description", type="string", example="Survey to measure customer satisfaction"),
     *             @OA\Property(property="created_by", type="string", example="68ee3e2c5336195833053652"),
     *             @OA\Property(property="is_published", type="boolean", example=false),
     *             @OA\Property(property="current_version", type="integer", example=1),
     *             @OA\Property(property="visibility", type="string", example="public"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
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
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *             @OA\Property(property="description", type="string", example="Survey to measure customer satisfaction"),
     *             @OA\Property(property="created_by", type="string", example="68ee3e2c5336195833053652"),
     *             @OA\Property(property="password", type="string", example="secret123"),
     *             @OA\Property(property="is_published", type="boolean", example=false),
     *             @OA\Property(property="current_version", type="integer", example=1),
     *             @OA\Property(property="visibility", type="string", enum={"public", "private", "restricted"}, example="public")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Form created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form created successfully"),
     *             @OA\Property(
     *                 property="form",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="68ee4fc2754f6e95b809e492"),
     *                 @OA\Property(property="title", type="string", example="Customer Satisfaction Survey"),
     *                 @OA\Property(property="description", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'created_by' => 'nullable|string|regex:/^[a-f0-9]{24}$/',
            'password' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'current_version' => 'nullable|integer',
            'visibility' => 'nullable|in:public,private,restricted',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $form = Form::create($request->all());

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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(
     *             type="string",
     *             pattern="^[a-f0-9]{24}$",
     *             example="68ee4fc2754f6e95b809e492"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="title", type="string", example="Updated Survey Title"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="is_published", type="boolean", example=true),
     *             @OA\Property(property="visibility", type="string", enum={"public", "private", "restricted"}, example="public")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form updated successfully"),
     *             @OA\Property(property="form", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
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
            'password' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'current_version' => 'nullable|integer',
            'visibility' => 'nullable|in:public,private,restricted',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $form->update($request->all());

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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(
     *             type="string",
     *             pattern="^[a-f0-9]{24}$",
     *             example="68ee4fc2754f6e95b809e492"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
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
