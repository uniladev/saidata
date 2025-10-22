<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'SAIDATA') }} API</title>
    
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600" rel="stylesheet" />
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #1a1a1a;
        }
        
        .container {
            max-width: 480px;
            width: 100%;
            text-align: center;
        }
        
        .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #10b981;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 32px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(0.95);
            }
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1a1a1a;
            letter-spacing: -0.02em;
        }
        
        .subtitle {
            font-size: 1.125rem;
            color: #6b7280;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 48px;
        }
        
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: #0000FF;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 1rem;
            transition: all 0.2s ease;
            border: 1px solid #0000FF;
        }
        .button-green{
            background: #10b981;
            padding: 14px 32px;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 1rem;
            transition: all 0.2s ease;
            border: 1px solid #10b981;
        }
        
        .button:hover {
            background: #0000CC;
            border-color: #0000CC;
            transform: translateY(-1px);
        }
        
        .button:active {
            transform: translateY(0);
        }
        
        .footer {
            margin-top: 64px;
            color: #9ca3af;
            font-size: 0.875rem;
        }
        
        @media (max-width: 640px) {
            h1 {
                font-size: 2rem;
            }
            
            .subtitle {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status">
            <span class="status-dot"></span>
            <span>API Running</span>
        </div>
        
        <h1>SAIDATA API</h1>
        
        <p class="subtitle">
            Backend service for SAIDATA application.<br>
            Please use the frontend interface to access the system.
        </p>
        
        <a href="http://localhost:5173" class="button">
            Open Application
        </a>
         <a href="http://127.0.0.1:8000/api/documentation#/" class="button-green">
            Open Documentation
        </a>
        
        <div class="footer">
            &copy; {{ date('Y') }} SAIDATA
        </div>
    </div>
</body>
</html>