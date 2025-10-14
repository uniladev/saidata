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
     *     summary="Get user profile",
     *     description="Retrieve user profile by user ID",
     *     tags={"User Profiles"},
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User profile details",
     *         @OA\JsonContent(
     *             type="object",
     *             example={
     *                 "id": 1,
     *                 "user_id": 5,
     *                 "full_name": "John Doe",
     *                 "phone": "+628123456789",
     *                 "address": "Jakarta, Indonesia",
     *                 "date_of_birth": "1990-01-01",
     *                 "avatar_url": "https://example.com/avatar.jpg",
     *                 "created_at": "2025-10-14T10:00:00.000000Z",
     *                 "updated_at": "2025-10-14T10:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Profile not found"
     *     )
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
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer", example=5),
     *             @OA\Property(property="full_name", type="string", example="John Doe"),
     *             @OA\Property(property="phone", type="string", example="+628123456789"),
     *             @OA\Property(property="address", type="string", example="Jakarta, Indonesia"),
     *             @OA\Property(property="date_of_birth", type="string", format="date", example="1990-01-01"),
     *             @OA\Property(property="avatar_url", type="string", example="https://example.com/avatar.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Profile created successfully"
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
            'user_id' => 'required|integer|unique:user_profiles,user_id',
            'full_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'avatar_url' => 'nullable|url',
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
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Profile ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="full_name", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="address", type="string"),
     *             @OA\Property(property="date_of_birth", type="string", format="date"),
     *             @OA\Property(property="avatar_url", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Profile updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Profile not found"
     *     )
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
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'date_of_birth' => 'sometimes|date',
            'avatar_url' => 'sometimes|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile->update($request->only(['full_name', 'phone', 'address', 'date_of_birth', 'avatar_url']));

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
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Profile ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Profile deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Profile not found"
     *     )
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
