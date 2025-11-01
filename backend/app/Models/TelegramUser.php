<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TelegramUser extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'telegram_users';

    protected $fillable = [
        'user_id',
        'chat_id',
        'username',
        'first_name',
    ];
}
