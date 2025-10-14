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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="formId",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the form",
     *         @OA\Schema(
     *             type="string",
     *             pattern="^[a-f0-9]{24}$",
     *             example="68ee4fc2754f6e95b809e492"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of form versions",
     *         @OA\JsonContent(type="array", @OA\Items(type="object"))
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="Form version details"),
     *     @OA\Response(response=404, description="Form version not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
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
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"form_id", "version_number", "schema"},
     *             @OA\Property(property="form_id", type="string", example="68ee4fc2754f6e95b809e492"),
     *             @OA\Property(property="version_number", type="integer", example=1),
     *             @OA\Property(property="schema", type="object")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Form version created successfully"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'form_id' => 'required|string|regex:/^[a-f0-9]{24}$/',
            'version_number' => 'required|integer',
            'schema' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $version = FormVersion::create($request->all());

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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="schema", type="object"),
     *             @OA\Property(property="version_number", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Form version updated successfully"),
     *     @OA\Response(response=404, description="Form version not found"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
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
            'schema' => 'sometimes|required|array',
            'version_number' => 'sometimes|required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $version->update($request->all());

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
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="Form version deleted successfully"),
     *     @OA\Response(response=404, description="Form version not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
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
