<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="SAIDATA API Documentation",
 *     version="1.0.0",
 *     description="API Documentation untuk Sistem Informasi Akademik FMIPA",
 *     @OA\Contact(
 *         email="admin@fmipa.unila.ac.id",
 *         name="FMIPA Unila"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="Local Development Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter JWT token in format: Bearer {token}"
 * )
 */
abstract class Controller
{
    //
}
