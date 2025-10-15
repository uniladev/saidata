<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/users/{userId}/profile",
     *     summary="Get user profile by user ID",
     *     description="Retrieve profile for a specific user",
     *     tags={"User Profiles"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId of the user",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="User profile details"),
     *     @OA\Response(response=404, description="Profile not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function show($userId)
    {
        $profile = UserProfile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        return response()->json($profile, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/user-profiles",
     *     summary="Create user profile",
     *     description="Create a new user profile",
     *     tags={"User Profiles"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="string", example="68ee3e2c5336195833053652"),
     *             @OA\Property(property="full_name", type="string", example="John Doe"),
     *             @OA\Property(property="phone", type="string", example="+1234567890"),
     *             @OA\Property(property="address", type="string", example="123 Main St")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Profile created successfully"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|string|regex:/^[a-f0-9]{24}$/',
            'full_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile = UserProfile::create($request->all());

        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/user-profiles/{id}",
     *     summary="Update user profile",
     *     description="Update an existing user profile",
     *     tags={"User Profiles"},
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
     *             @OA\Property(property="full_name", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="address", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Profile updated successfully"),
     *     @OA\Response(response=404, description="Profile not found"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function update(Request $request, $id)
    {
        $profile = UserProfile::find($id);

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile->update($request->all());

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/user-profiles/{id}",
     *     summary="Delete user profile",
     *     description="Delete a user profile",
     *     tags={"User Profiles"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="MongoDB ObjectId",
     *         @OA\Schema(type="string", pattern="^[a-f0-9]{24}$")
     *     ),
     *     @OA\Response(response=200, description="Profile deleted successfully"),
     *     @OA\Response(response=404, description="Profile not found"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function destroy($id)
    {
        $profile = UserProfile::find($id);

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        $profile->delete();

        return response()->json([
            'message' => 'Profile deleted successfully'
        ], 200);
    }
}
