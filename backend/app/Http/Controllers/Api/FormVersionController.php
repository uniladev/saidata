<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormVersionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/forms/{formId}/versions",
     *     summary="Get all versions of a form",
     *     description="Retrieve all versions for a specific form",
     *     tags={"Form Versions"},
     *     @OA\Parameter(
     *         name="formId",
     *         in="path",
     *         required=true,
     *         description="Form ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of form versions",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="form_id", type="integer", example=1),
     *                 @OA\Property(property="version_number", type="integer", example=1),
     *                 @OA\Property(property="schema_json", type="string", example="{}"),
     *                 @OA\Property(property="is_active", type="boolean", example=true),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-14T10:00:00.000000Z")
     *             )
     *         )
     *     )
     * )
     */
    public function index($formId)
    {
        $versions = FormVersion::where('form_id', $formId)->get();
        return response()->json($versions, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/form-versions/{id}",
     *     summary="Get form version by ID",
     *     description="Retrieve a specific form version",
     *     tags={"Form Versions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form Version ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form version details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="form_id", type="integer", example=1),
     *             @OA\Property(property="version_number", type="integer", example=1),
     *             @OA\Property(property="schema_json", type="string"),
     *             @OA\Property(property="is_active", type="boolean", example=true),
     *             @OA\Property(property="created_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form version not found"
     *     )
     * )
     */
    public function show($id)
    {
        $version = FormVersion::find($id);

        if (!$version) {
            return response()->json([
                'message' => 'Form version not found'
            ], 404);
        }

        return response()->json($version, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/form-versions",
     *     summary="Create new form version",
     *     description="Create a new version for a form",
     *     tags={"Form Versions"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"form_id", "version_number", "schema_json"},
     *             @OA\Property(property="form_id", type="integer", example=1),
     *             @OA\Property(property="version_number", type="integer", example=1),
     *             @OA\Property(property="schema_json", type="string", example="{}"),
     *             @OA\Property(property="is_active", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Form version created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form version created successfully"),
     *             @OA\Property(property="version", type="object")
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
            'form_id' => 'required|integer',
            'version_number' => 'required|integer',
            'schema_json' => 'required|json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Deactivate other versions if this is set as active
        if ($request->is_active) {
            FormVersion::where('form_id', $request->form_id)
                ->update(['is_active' => false]);
        }

        $version = FormVersion::create([
            'form_id' => $request->form_id,
            'version_number' => $request->version_number,
            'schema_json' => $request->schema_json,
            'is_active' => $request->is_active ?? false,
        ]);

        return response()->json([
            'message' => 'Form version created successfully',
            'version' => $version
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/form-versions/{id}",
     *     summary="Update form version",
     *     description="Update an existing form version",
     *     tags={"Form Versions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form Version ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="schema_json", type="string"),
     *             @OA\Property(property="is_active", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form version updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form version updated successfully"),
     *             @OA\Property(property="version", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form version not found"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $version = FormVersion::find($id);

        if (!$version) {
            return response()->json([
                'message' => 'Form version not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'schema_json' => 'sometimes|required|json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Deactivate other versions if this is being set as active
        if ($request->has('is_active') && $request->is_active) {
            FormVersion::where('form_id', $version->form_id)
                ->where('id', '!=', $id)
                ->update(['is_active' => false]);
        }

        $version->update($request->only(['schema_json', 'is_active']));

        return response()->json([
            'message' => 'Form version updated successfully',
            'version' => $version
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/form-versions/{id}",
     *     summary="Delete form version",
     *     description="Delete a form version",
     *     tags={"Form Versions"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Form Version ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form version deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Form version deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Form version not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        $version = FormVersion::find($id);

        if (!$version) {
            return response()->json([
                'message' => 'Form version not found'
            ], 404);
        }

        $version->delete();

        return response()->json([
            'message' => 'Form version deleted successfully'
        ], 200);
    }
}
