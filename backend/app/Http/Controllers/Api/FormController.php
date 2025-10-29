<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\FormHistory;
use App\Models\FormSubmission;
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
     *                 @OA\Property(property="type", type="string", enum={"service", "record"}, example="record", description="Form type: service or record"),
     *                 @OA\Property(property="has_output", type="boolean", example=false, description="Whether form generates output/results"),
     *                 @OA\Property(property="template_url", type="string", nullable=true, example="templates/forms/671292eb4c6b7a0d4e0b1234/1730000000_template.pdf", description="Path to template document"),
     *                 @OA\Property(
     *                     property="template_metadata",
     *                     type="object",
     *                     nullable=true,
     *                     @OA\Property(property="original_name", type="string", example="Form_Template.pdf"),
     *                     @OA\Property(property="size", type="integer", example=1024000),
     *                     @OA\Property(property="mime_type", type="string", example="application/pdf"),
     *                     @OA\Property(property="uploaded_at", type="string", format="date-time"),
     *                     @OA\Property(property="uploaded_by", type="string", example="68ee3e2c533619c833053652")
     *                 ),
     *                 @OA\Property(
     *                     property="metadata",
     *                     type="object",
     *                     nullable=true,
     *                     description="Custom metadata for the form, e.g. category, tags, etc. Must be an object or array, not a string.",
     *                     example={"category":"survey","tags":{"customer","feedback"}}
     *                 ),
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
     *                         @OA\Property(property="validation", type="object", description="Validation rules object", nullable=true, example={}),
     *                         @OA\Property(property="options", type="array", @OA\Items(type="string"), description="Options for select, radio, checkbox fields", example={"Option 1", "Option 2"}),
     *                         @OA\Property(property="fileOptions", type="object", nullable=true, description="File upload options", example={}),
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
     *     @OA\Property(property="type", type="string", enum={"service", "record"}, example="record", description="Form type"),
     *     @OA\Property(property="has_output", type="boolean", example=false, description="Whether form generates output"),
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
     *     @OA\Property(
     *         property="metadata",
     *         type="object",
     *         nullable=true,
     *         description="Custom metadata for the form, e.g. category, tags, etc.",
     *         example={"category":"survey","tags":{"customer","feedback"}}
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
            'form.type' => 'nullable|in:service,record',
            'form.has_output' => 'nullable|boolean',
            'form.fields' => 'required|array|min:1',
            'form.metadata' => 'nullable|array',
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
            'form.type.in' => 'Form type must be either "service" or "record"',
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

            // Ensure metadata is always an array
            $formData['metadata'] = $formData['metadata'] ?? [];

            // Prepare form data with defaults
            $formData['created_by'] = (string) $user->_id;
            $formData['updated_by'] = (string) $user->_id;
            $formData['version'] = 1;
            $formData['is_active'] = $formData['is_active'] ?? true;
            $formData['type'] = $formData['type'] ?? 'record';
            $formData['has_output'] = $formData['has_output'] ?? false;
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
     *     description="Update an existing form. Backend will preserve existing field IDs and generate new IDs for new fields. Supports template document upload.",
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
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"form"},
     *                 @OA\Property(
     *                     property="form",
     *                     type="string",
     *                     description="JSON string of form data with title, description, fields, etc.",
     *                     example="{""title"":""Updated Form"",""type"":""service"",""has_output"":true,""fields"":[{""type"":""text"",""label"":""Name"",""name"":""name"",""required"":true}]}"
     *                 ),
     *                 @OA\Property(
     *                     property="template",
     *                     type="string",
     *                     format="binary",
     *                     description="Template document file (DOCX)"
     *                 ),
     *                 @OA\Property(
     *                     property="remove_template",
     *                     type="boolean",
     *                     example=false,
     *                     description="Set to true to remove existing template"
     *                 ),
     *                 @OA\Property(
     *                     property="increment_version",
     *                     type="boolean",
     *                     example=false,
     *                     description="Set to true to create new version"
     *                 ),
     *                 @OA\Property(
     *                     property="change_summary",
     *                     type="string",
     *                     example="Added template document",
     *                     description="Summary of changes made"
     *                 )
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
     *                 @OA\Property(property="previous_version", type="integer", example=1),
     *                 @OA\Property(property="template_updated", type="boolean", example=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden - Not the form creator")
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

        // Check if user is the creator (optional - remove if anyone can update)
        // Uncomment below if only creator can add templates
        // if ($form->created_by !== (string) $user->_id) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Only the form creator can update templates'
        //     ], 403);
        // }

        // Parse form data from JSON string if multipart/form-data
        $formData = $request->has('form') ? json_decode($request->input('form'), true) : $request->input('form');
        
        // Validate the update request
        $validator = Validator::make(array_merge(
            ['form' => $formData],
            $request->only(['template', 'remove_template', 'increment_version', 'change_summary'])
        ), [
            'form' => 'required|array',
            'form.title' => 'nullable|string|max:255',
            'form.description' => 'nullable|string',
            'form.submitText' => 'nullable|string|max:100',
            'form.successMessage' => 'nullable|string|max:500',
            'form.is_active' => 'nullable|boolean',
            'form.type' => 'nullable|in:service,record',
            'form.has_output' => 'nullable|boolean',
            'form.fields' => 'nullable|array|min:1',
            'form.metadata' => 'nullable|array',
            'form.fields.*.type' => 'required_with:form.fields|in:text,textarea,number,email,date,time,datetime-local,url,tel,password,select,radio,checkbox,file,rating,signature,matrix,repeater',
            'form.fields.*.label' => 'required_with:form.fields|string|max:255',
            'form.fields.*.name' => 'required_with:form.fields|string|max:255',
            'template' => 'nullable|file|mimes:doc,docx|max:5240', // 5MB max
            'remove_template' => 'nullable|boolean',
            'increment_version' => 'nullable|boolean',
            'change_summary' => 'nullable|string|max:500',
        ], [
            'form.type.in' => 'Form type must be either "service" or "record"',
            'template.mimes' => 'Template must be a DOC & DOCX file',
            'template.max' => 'Template file size must not exceed 5MB',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $incrementVersion = $request->input('increment_version', false);
            $changeSummary = $request->input('change_summary', 'Form updated');
            $templateUpdated = false;

            // Handle template removal
            if ($request->input('remove_template', false)) {
                if ($form->template_url) {
                    // Delete old template file
                    \Storage::disk('public')->delete($form->template_url);
                    $formData['template_url'] = null;
                    $formData['template_metadata'] = null;
                    $templateUpdated = true;
                    $changeSummary = $changeSummary ?: 'Template removed';
                }
            }

            // Handle template upload
            if ($request->hasFile('template')) {
                // Delete old template if exists
                if ($form->template_url) {
                    \Storage::disk('public')->delete($form->template_url);
                }

                $file = $request->file('template');
                
                // Create directory for form templates
                $directory = "templates/forms/{$id}";
                
                // Generate unique filename
                $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                           . '.' . $file->getClientOriginalExtension();
                
                // Store file
                $path = $file->storeAs($directory, $filename, 'public');
                
                // Update form data with template info
                $formData['template_url'] = $path;
                $formData['template_metadata'] = [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'uploaded_at' => now()->toISOString(),
                    'uploaded_by' => (string) $user->_id,
                ];
                
                $templateUpdated = true;
                $changeSummary = $changeSummary ?: 'Template document added';
            }

            // Update metadata
            $formData['metadata'] = $formData['metadata'] ?? $form->metadata ?? [];
            $formData['updated_by'] = (string) $user->_id;

            // Update the form version if needed
            $previousVersion = $form->version;
            
            if ($incrementVersion) {
                $formData['version'] = $form->version + 1;
            }

            // Update the form
            $form->update($formData);
            $form->refresh();

            // Create history record if version incremented
            if ($incrementVersion) {
                FormHistory::create([
                    'form_id' => $form->_id,
                    'version' => $form->version,
                    'title' => $form->title,
                    'slug' => $form->slug,
                    'description' => $form->description,
                    'submitText' => $form->submitText,
                    'successMessage' => $form->successMessage,
                    'fields' => $form->fields,
                    'template_url' => $form->template_url,
                    'template_metadata' => $form->template_metadata,
                    'changed_by' => (string) $user->_id,
                    'change_summary' => $changeSummary,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Form updated successfully',
                'data' => [
                    'form' => $form->load(['creator:_id,name,email', 'updater:_id,name,email']),
                    'version_incremented' => $incrementVersion,
                    'previous_version' => $previousVersion,
                    'template_updated' => $templateUpdated,
                ]
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
     * @OA\Patch(
     *     path="/api/v1/forms/{id}/toggle-status",
     *     summary="Toggle form active/inactive status",
     *     description="Toggle form between active and inactive status. Inactive forms cannot receive new submissions.",
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
     *         description="Form status toggled successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Form status updated successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="_id", type="string"),
     *                 @OA\Property(property="title", type="string"),
     *                 @OA\Property(property="is_active", type="boolean", example=false),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=404, description="Form not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function toggleStatus($id)
    {
        $form = Form::find($id);

        if (!$form) {
            return response()->json([
                'success' => false,
                'message' => 'Form not found'
            ], 404);
        }

        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Toggle the is_active status
        $form->is_active = !$form->is_active;
        $form->updated_by = (string) $user->_id;
        $form->save();

        return response()->json([
            'success' => true,
            'message' => 'Form status updated successfully',
            'data' => [
                '_id' => $form->_id,
                'title' => $form->title,
                'is_active' => $form->is_active,
                'updated_at' => $form->updated_at,
            ]
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/forms/{id}",
     *     summary="Delete form permanently",
     *     description="Permanently delete a form. Only forms with zero submissions can be deleted.",
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
     *     @OA\Response(
     *         response=403,
     *         description="Cannot delete form with submissions",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Cannot delete form with existing submissions"),
     *             @OA\Property(property="submission_count", type="integer", example=5)
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

        // Check if form has any submissions
        $submissionCount = FormSubmission::where('form_id', $id)->count();

        if ($submissionCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete form with existing submissions',
                'submission_count' => $submissionCount
            ], 403);
        }

        try {
            // Delete form history first
            FormHistory::where('form_id', $id)->delete();

            // Delete the form
            $form->delete();

            return response()->json([
                'success' => true,
                'message' => 'Form deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete form',
                'error' => $e->getMessage()
            ], 500);
        }
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

            if (
                $oldField['type'] !== $newField['type'] ||
                $oldField['name'] !== $newField['name']
            ) {
                return true;
            }
        }

        return false;
    }
}