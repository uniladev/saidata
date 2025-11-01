<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // ⬅️ tambahin ini bro
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TelegramController extends Controller
{
    protected $token;

    public function __construct()
    {
        $this->token = env('TELEGRAM_BOT_TOKEN');
    }


    /**
     * @OA\Get(
     *     path="/api/v1/telegram/updates",
     *     tags={"Telegram"},
     *     summary="Ambil update dari Telegram Bot",
     *     @OA\Response(
     *         response=200,
     *         description="List update dari Telegram"
     *     )
     * )
     */

    public function getUpdates()
    {
        $url = "https://api.telegram.org/bot{$this->token}/getUpdates";
        $response = Http::get($url);
        return response()->json($response->json());
    }


    /**
     * @OA\Get(
     *     path="/api/v1/telegram/test",
     *     tags={"Telegram"},
     *     summary="Kirim pesan percobaan ke Telegram",
     *     @OA\Response(
     *         response=200,
     *         description="Pesan terkirim ke Telegram"
     *     )
     * )
     */
    
    public function testSend()
    {
        $chatId = '1227033856';
        $message = "Halo bro! Bot Telegram kamu udah nyala 🎉";

        $url = "https://api.telegram.org/bot{$this->token}/sendMessage";
        $response = Http::post($url, [
            'chat_id' => $chatId,
            'text' => $message,
        ]);

        return response()->json($response->json());
    }
}
