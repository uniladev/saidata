<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\TelegramUser;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Http;

/**
 * @OA\Tag(
 *     name="Submission",
 *     description="Manajemen validasi dan notifikasi pengajuan"
 * )
 */

class SubmissionController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/v1/submissions/{id}/validate",
     *     tags={"Submission"},
     *     summary="Validasi submission dan kirim notifikasi Telegram",
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID submission yang akan divalidasi",
     *         required=true,
     *         @OA\Schema(type="string", example="66dfe88f8a9b1c0012a8d4e0")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", example="approved")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Submission validated and Telegram notification sent"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Submission not found"
     *     )
     * )
     */
    
    public function validateSubmission(Request $request, $id)
    {
        // Ambil data submission
        $submission = Submission::find($id);

        if (!$submission) {
            return response()->json(['error' => 'Submission not found'], 404);
        }

        // Update status
        $submission->status = $request->status; // misal 'approved' / 'rejected'
        $submission->validated_by = auth()->user()->id;
        $submission->save();

        // Cek apakah mahasiswa punya chat_id Telegram
        $telegramUser = TelegramUser::where('user_id', $submission->user_id)->first();

        if ($telegramUser && $telegramUser->chat_id) {
            $message = "📢 Status pengajuan kamu telah diperbarui!\n\n"
                     . "📄 Berkas: {$submission->title}\n"
                     . "✅ Status: {$submission->status}\n"
                     . "🕒 Tanggal: " . now()->format('d-m-Y H:i');

            // Kirim ke bot Telegram
            $botToken = config('services.telegram.bot_token');
            $chatId = $telegramUser->chat_id;
            $telegram = new TelegramService();
            $telegram->sendMessage($chatId, $message);
        }

        return response()->json([
            'message' => 'Submission validated and Telegram notification sent (if chat_id exists).'
        ]);
    }
}
