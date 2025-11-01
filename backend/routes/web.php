<?php

use App\Services\TelegramService;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/test-telegram', function () {
    $telegram = new TelegramService();
    $telegram->sendMessage('1227033856', '🔥 Notifikasi dari sistem berhasil bro!');
    return 'Pesan terkirim ke Telegram!';
});
