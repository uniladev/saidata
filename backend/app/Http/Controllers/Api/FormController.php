<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\FormHistory;
use Illuminate\Support\Facades\DB;


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
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Form"))
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index()
    {
        $forms = Form::with(['creator:_id,name,email', 'updater:_id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $forms
        ], 200);
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
     *         description="MongoDB ObjectId (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form details",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/Form")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function show($id)
    {
        $form = Form::with(['creator:_id,name,email', 'updater:_id,name,email'])
            ->find($id);

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $form
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/forms",
     *     summary="Create new form",
     *     description="Create a new form with fields structure. Backend will generate MongoDB ObjectId and field IDs automatically.",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"form"},
     *             @OA\Property(
     *                 property="form",
     *                 type="object",
     *                 required={"title", "fields"},
     *                 @OA\Property(property="title", type="string", example="Untitled Form", maxLength=255),
     *                 @OA\Property(property="description", type="string", example="Form description"),
     *                 @OA\Property(property="submitText", type="string", example="Submit", description="Submit button text"),
     *                 @OA\Property(property="successMessage", type="string", example="Thank you for your submission!", description="Success message after submission"),
     *                 @OA\Property(property="is_active", type="boolean", example=true, description="Form active status"),
     *                 @OA\Property(
     *                     property="fields",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         required={"type", "label", "name"},
     *                         @OA\Property(property="type", type="string", enum={"text", "textarea", "number", "email", "date", "time", "datetime-local", "url", "tel", "password", "select", "radio", "checkbox", "file", "rating", "signature", "matrix", "repeater"}, example="text"),
     *                         @OA\Property(property="label", type="string", example="New Text Input"),
     *                         @OA\Property(property="name", type="string", example="field_1", description="Field name for form data"),
     *                         @OA\Property(property="required", type="boolean", example=false),
     *                         @OA\Property(property="placeholder", type="string", example="Enter text here"),
     *                         @OA\Property(property="helpText", type="string", example="Help text for the field"),
     *                         @OA\Property(property="validation", type="object", description="Validation rules object", nullable=true),
     *                         @OA\Property(property="options", type="array", @OA\Items(type="string"), description="Options for select, radio, checkbox fields"),
     *                         @OA\Property(property="fileOptions", type="object", nullable=true, description="File upload options"),
     *                         @OA\Property(property="min", type="number", nullable=true, example=0, description="Minimum value for number fields"),
     *                         @OA\Property(property="max", type="number", nullable=true, example=100, description="Maximum value for number fields"),
     *                         @OA\Property(property="step", type="number", nullable=true, description="Step value for number fields"),
     *                         @OA\Property(property="rows", type="integer", nullable=true, description="Rows for textarea"),
     *                         @OA\Property(property="maxRating", type="integer", nullable=true, description="Maximum rating value")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Form created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Form created successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/Form")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     * 
     * @OA\Schema(
     *     schema="Form",
     *     type="object",
     *     @OA\Property(property="_id", type="string", example="671292eb4c6b7a0d4e0b1234", description="MongoDB ObjectId"),
     *     @OA\Property(property="title", type="string", example="Untitled Form"),
     *     @OA\Property(property="description", type="string", example="Form description"),
     *     @OA\Property(property="submitText", type="string", example="Submit"),
     *     @OA\Property(property="successMessage", type="string", example="Thank you for your submission!"),
     *     @OA\Property(property="is_active", type="boolean", example=true),
     *     @OA\Property(
     *         property="fields",
     *         type="array",
     *         @OA\Items(
     *             type="object",
     *             @OA\Property(property="id", type="string", example="field_1760690243313_bhm124rg1", description="Backend-generated unique field identifier"),
     *             @OA\Property(property="type", type="string", example="text"),
     *             @OA\Property(property="label", type="string", example="New Text Input"),
     *             @OA\Property(property="name", type="string", example="field_1"),
     *             @OA\Property(property="required", type="boolean", example=false),
     *             @OA\Property(property="placeholder", type="string", example=""),
     *             @OA\Property(property="helpText", type="string", example=""),
     *             @OA\Property(property="validation", type="object", nullable=true),
     *             @OA\Property(property="options", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="fileOptions", type="object", nullable=true),
     *             @OA\Property(property="min", type="number", nullable=true),
     *             @OA\Property(property="max", type="number", nullable=true),
     *             @OA\Property(property="step", type="number", nullable=true),
     *             @OA\Property(property="rows", type="integer", nullable=true),
     *             @OA\Property(property="maxRating", type="integer", nullable=true)
     *         )
     *     ),
     *     @OA\Property(property="created_by", type="string", example="68ee3e2c533619c833053652"),
     *     @OA\Property(property="updated_by", type="string", example="68ee3e2c533619c833053652"),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time")
     * )
     */
    public function store(Request $request)
    {
        // Ensure the user is authenticated
        $user = JWTAuth::parseToken()->authenticate();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Validate base structure (no ID validation from frontend)
        $validator = Validator::make($request->all(), [
            'form' => 'required|array',
            'form.title' => 'required|string|max:255',
            'form.description' => 'nullable|string',
            'form.submitText' => 'nullable|string|max:100',
            'form.successMessage' => 'nullable|string|max:500',
            'form.is_active' => 'nullable|boolean',
            'form.fields' => 'required|array|min:1',
            'form.fields.*.type' => 'required|in:text,textarea,number,email,date,time,datetime-local,url,tel,password,select,radio,checkbox,file,rating,signature,matrix,repeater',
            'form.fields.*.label' => 'required|string|max:255',
            'form.fields.*.name' => 'required|string|max:255',
            'form.fields.*.required' => 'nullable|boolean',
            'form.fields.*.placeholder' => 'nullable|string',
            'form.fields.*.helpText' => 'nullable|string',
            'form.fields.*.validation' => 'nullable|array',
            'form.fields.*.options' => 'nullable|array',
            'form.fields.*.fileOptions' => 'nullable|array',
            'form.fields.*.min' => 'nullable|numeric',
            'form.fields.*.max' => 'nullable|numeric',
            'form.fields.*.step' => 'nullable|numeric',
            'form.fields.*.rows' => 'nullable|integer|min:0',
            'form.fields.*.maxRating' => 'nullable|integer|min:0',
        ], [
            'form.required' => 'Form data is required',
            'form.title.required' => 'Form title is required',
            'form.fields.required' => 'Form must have at least one field',
            'form.fields.min' => 'Form must have at least one field',
            'form.fields.*.type.required' => 'Each field must have a type',
            'form.fields.*.label.required' => 'Each field must have a label',
            'form.fields.*.name.required' => 'Each field must have a name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $formData = $request->input('form');
            
            // Validate field names are unique within the form
            $fieldNames = array_column($formData['fields'], 'name');
            if (count($fieldNames) !== count(array_unique($fieldNames))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => ['fields' => ['Duplicate field names found in form']]
                ], 422);
            }

            // Process fields and generate IDs for each field
            foreach ($formData['fields'] as &$field) {
                // Generate unique field ID
                $fieldId = 'field_' . time() . '_' . Str::random(10);
                $field['id'] = $fieldId;

                // Clean up field data - convert 0 values to null for optional fields
                if (isset($field['rows']) && $field['rows'] === 0) {
                    $field['rows'] = null;
                }
                if (isset($field['maxRating']) && $field['maxRating'] === 0) {
                    $field['maxRating'] = null;
                }
                if (isset($field['step']) && $field['step'] === 0) {
                    $field['step'] = null;
                }
                if (isset($field['min']) && $field['min'] === 0 && $field['type'] !== 'number') {
                    $field['min'] = null;
                }
                if (isset($field['max']) && $field['max'] === 0) {
                    $field['max'] = null;
                }
                
                // Clean up empty objects/arrays
                if (isset($field['validation']) && empty($field['validation'])) {
                    $field['validation'] = null;
                }
                if (isset($field['fileOptions']) && empty($field['fileOptions'])) {
                    $field['fileOptions'] = null;
                }

                // Add a small delay to ensure unique timestamps
                usleep(100);
            }

            // Prepare form data
            $formData['created_by'] = (string) $user->_id;
            $formData['updated_by'] = (string) $user->_id;
            $formData['version'] = 1;
            $formData['is_active'] = $formData['is_active'] ?? true;
            // Set default values if not provided
            $formData['submitText'] = $formData['submitText'] ?? 'Submit';
            $formData['successMessage'] = $formData['successMessage'] ?? 'Thank you for your submission!';
            $formData['description'] = $formData['description'] ?? '';

            // Create the form (MongoDB will auto-generate _id)
            $form = Form::create($formData);

            // Refresh the model to ensure _id is loaded
            $form->refresh();

             // Create initial history record
            FormHistory::create([
                'form_id' => $form->_id,
                'version' => 1,
                'title' => $form->title,
                'slug' => $form->slug,
                'description' => $form->description,
                'submitText' => $form->submitText,
                'successMessage' => $form->successMessage,
                'fields' => $form->fields,
                'changed_by' => (string) $user->_id,
                'change_summary' => 'Initial form creation',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Form created successfully',
                'data' => $form->load(['creator:_id,name,email', 'updater:_id,name,email'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/forms/{id}",
     *     summary="Update form",
     *     description="Update an existing form. Backend will preserve existing field IDs and generate new IDs for new fields.",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"form"},
     *             @OA\Property(
     *                 property="form",
     *                 type="object",
     *                 @OA\Property(property="title", type="string", example="Updated Form Title"),
     *                 @OA\Property(property="description", type="string", example="Updated description"),
     *                 @OA\Property(property="submitText", type="string", example="Submit"),
     *                 @OA\Property(property="successMessage", type="string", example="Thank you!"),
     *                 @OA\Property(property="is_active", type="boolean"),
     *                 @OA\Property(
     *                     property="fields",
     *                     type="array",
     *                     description="Fields array. Include 'id' for existing fields to preserve them, omit 'id' for new fields.",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="string", description="Include this for existing fields", example="field_1760690243313_bhm124rg1"),
     *                         @OA\Property(property="type", type="string", example="text"),
     *                         @OA\Property(property="label", type="string", example="Updated Label"),
     *                         @OA\Property(property="name", type="string", example="field_1")
     *                     )
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="increment_version",
     *                 type="boolean",
     *                 example=true,
     *                 description="Set to true to create new version (recommended when changing fields structure)"
     *             ),
     *             @OA\Property(
     *                 property="change_summary",
     *                 type="string",
     *                 example="Updated question 3, added new email field",
     *                 description="Summary of changes made"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Form updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="form", ref="#/components/schemas/Form"),
     *                 @OA\Property(property="version_incremented", type="boolean", example=true),
     *                 @OA\Property(property="previous_version", type="integer", example=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function update(Request $request, $id)
    {
        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        // Validate the entire form structure
        $validator = Validator::make($request->all(), [
            'form' => 'required|array',
            'form.title' => 'sometimes|required|string|max:255',
            'form.description' => 'nullable|string',
            'form.submitText' => 'nullable|string|max:100',
            'form.successMessage' => 'nullable|string|max:500',
            'form.is_active' => 'nullable|boolean',
            'form.fields' => 'sometimes|required|array|min:1',
            'increment_version' => 'nullable|boolean',
            'change_summary' => 'nullable|string|max:500',
            'form.fields.*.id' => 'nullable|string|max:255',
            'form.fields.*.type' => 'required|in:text,textarea,number,email,date,time,datetime-local,url,tel,password,select,radio,checkbox,file,rating,signature,matrix,repeater',
            'form.fields.*.label' => 'required|string|max:255',
            'form.fields.*.name' => 'required|string|max:255',
            'form.fields.*.required' => 'nullable|boolean',
            'form.fields.*.placeholder' => 'nullable|string',
            'form.fields.*.helpText' => 'nullable|string',
            'form.fields.*.validation' => 'nullable|array',
            'form.fields.*.options' => 'nullable|array',
            'form.fields.*.fileOptions' => 'nullable|array',
            'form.fields.*.min' => 'nullable|numeric',
            'form.fields.*.max' => 'nullable|numeric',
            'form.fields.*.step' => 'nullable|numeric',
            'form.fields.*.rows' => 'nullable|integer|min:0',
            'form.fields.*.maxRating' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $formData = $request->input('form');
            $incrementVersion = $request->input('increment_version', false);
            $changeSummary = $request->input('change_summary', 'Form updated');
            
            $previousVersion = $form->version;
            $versionIncremented = false;

            // Check if structure changed
            $structureChanged = false;
            
            // Validate uniqueness if fields are being updated
            if (isset($formData['fields'])) {
                $fieldNames = array_column($formData['fields'], 'name');
                if (count($fieldNames) !== count(array_unique($fieldNames))) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Validation error',
                        'errors' => ['fields' => ['Duplicate field names found in form']]
                    ], 422);
                }
                
                // Process fields: generate IDs for new fields, keep existing IDs
                foreach ($formData['fields'] as &$field) {
                    // If field doesn't have an ID, it's a new field - generate one
                    if (!isset($field['id']) || empty($field['id'])) {
                        $fieldId = 'field_' . time() . '_' . Str::random(10);
                        $field['id'] = $fieldId;
                        usleep(100); // Small delay for unique timestamps
                    }

                    // Clean up field data
                    if (isset($field['rows']) && $field['rows'] === 0) {
                        $field['rows'] = null;
                    }
                    if (isset($field['maxRating']) && $field['maxRating'] === 0) {
                        $field['maxRating'] = null;
                    }
                    if (isset($field['step']) && $field['step'] === 0) {
                        $field['step'] = null;
                    }
                    if (isset($field['min']) && $field['min'] === 0 && $field['type'] !== 'number') {
                        $field['min'] = null;
                    }
                    if (isset($field['max']) && $field['max'] === 0) {
                        $field['max'] = null;
                    }
                    if (isset($field['validation']) && empty($field['validation'])) {
                        $field['validation'] = null;
                    }
                    if (isset($field['fileOptions']) && empty($field['fileOptions'])) {
                        $field['fileOptions'] = null;
                    }
                }
                $structureChanged = $this->hasStructureChanged($form->fields, $formData['fields']);
            }
            // Use transaction for atomicity
        
                // Save current version to history if structure changed or version increment requested
                if ($structureChanged || $incrementVersion) {
                    FormHistory::create([
                        'form_id' => $form->_id,
                        'version' => $form->version,
                        'title' => $form->title,
                        'slug' => $form->slug,
                        'description' => $form->description,
                        'submitText' => $form->submitText,
                        'successMessage' => $form->successMessage,
                        'fields' => $form->fields,
                        'changed_by' => (string) $user->_id,
                        'change_summary' => $changeSummary,
                    ]);

                    // Increment version
                    $formData['version'] = $form->version + 1;
                    $versionIncremented = true;
                }
                // Update timestamp and user
                $formData['updated_by'] = (string) $user->_id;

                // Exclude sensitive fields from update
                unset($formData['created_by'], $formData['created_at'], $formData['_id']);

                // Update the form (MongoDB document operations are atomic)
                $form->update($formData);
            

            // Refresh the model to ensure _id and updated data are properly loaded
            $form->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Form updated successfully',
                'data' => $form->load(['creator:_id,name,email', 'updater:_id,name,email'])
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/forms/{id}",
     *     summary="Delete form",
     *     description="Delete a form permanently",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId (24 character hex string)",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Form deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function destroy($id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        // Soft delete by setting is_active to false
        $form->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Form deleted successfully'
        ], 200);
    }
      /**
     * @OA\Get(
     *     path="/api/v1/forms/{id}/history",
     *     summary="Get form version history",
     *     description="Retrieve all version history of a form",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form version history",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="_id", type="string"),
     *                     @OA\Property(property="form_id", type="string"),
     *                     @OA\Property(property="version", type="integer", example=1),
     *                     @OA\Property(property="title", type="string"),
     *                     @OA\Property(property="fields", type="array", @OA\Items(type="object")),
     *                     @OA\Property(property="change_summary", type="string"),
     *                     @OA\Property(property="changed_by", type="object"),
     *                     @OA\Property(property="created_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found")
     * )
     */
    public function history($id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        $history = FormHistory::where('form_id', $id)
            ->with('changedBy:_id,name,email')
            ->orderBy('version', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $history
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/forms/{id}/version/{version}",
     *     summary="Get specific form version",
     *     description="Retrieve a specific version of a form from history",
     *     tags={"Forms"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", example="671292eb4c6b7a0d4e0b1234")
     *     ),
     *     @OA\Parameter(
     *         name="version",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Form version details",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Version not found")
     * )
     */
    public function showVersion($id, $version)
    {
        $formVersion = FormHistory::where('form_id', $id)
            ->where('version', $version)
            ->with('changedBy:_id,name,email')
            ->first();

        if (!$formVersion) {
            return response()->json([
                'success' => false,
                'message' => 'Form version not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $formVersion
        ], 200);
    }

    // Add this new method to FormController.php
    public function showBySlug($slug)
    {
        // Find the form using the 'slug' column instead of the 'id'
        $form = Form::where('slug', $slug) 
                    ->with(['creator:_id,name,email', 'updater:_id,name,email'])
                    ->first(); // Use first() to get a single result

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $form
        ], 200);
    }
     /**
     * Helper method to detect structure changes
     */
    private function hasStructureChanged($oldFields, $newFields)
    {
        // Simple comparison - you can make this more sophisticated
        if (count($oldFields) !== count($newFields)) {
            return true;
        }

        // Check if field types or names changed
        foreach ($newFields as $index => $newField) {
            if (!isset($oldFields[$index])) {
                return true;
            }

            $oldField = $oldFields[$index];
            
            if ($oldField['type'] !== $newField['type'] || 
                $oldField['name'] !== $newField['name']) {
                return true;
            }
        }

        return false;
    }
}