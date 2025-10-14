<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;

class TestDatabaseConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:test {connection?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test database connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $connection = $this->argument('connection') ?: config('database.default');
        
        $this->info("Testing database connection: {$connection}");
        $this->newLine();

        try {
            // Test connection
            DB::connection($connection)->getPdo();
            
            $this->components->info('✓ Database connection successful!');
            $this->newLine();

            // Get connection details
            $driver = DB::connection($connection)->getDriverName();
            $database = DB::connection($connection)->getDatabaseName();
            
            $this->table(
                ['Property', 'Value'],
                [
                    ['Driver', $driver],
                    ['Database', $database],
                    ['Connection', $connection],
                ]
            );

            // Try a simple query
            $this->info('Testing query execution...');
            
            if ($driver === 'mongodb') {
                // MongoDB test
                $result = DB::connection($connection)->getMongoDB()->listCollections();
                $collections = iterator_to_array($result);
                $this->info('✓ Query executed successfully!');
                $this->info('Collections count: ' . count($collections));
                
                if (count($collections) > 0) {
                    $this->newLine();
                    $this->info('Available collections:');
                    foreach ($collections as $collection) {
                        $this->line('  - ' . $collection->getName());
                    }
                }
            } else {
                // SQL test
                $result = DB::connection($connection)->select('SELECT 1 as test');
                $this->info('✓ Query executed successfully!');
                $this->line('Result: ' . json_encode($result));
                
                // Show tables
                $tables = DB::connection($connection)->select('SHOW TABLES');
                if (count($tables) > 0) {
                    $this->newLine();
                    $this->info('Available tables: ' . count($tables));
                }
            }

            $this->newLine();
            $this->components->info('All tests passed! Database is ready to use.');
            
            return Command::SUCCESS;

        } catch (Exception $e) {
            $this->components->error('✗ Database connection failed!');
            $this->newLine();
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            
            $this->warn('Troubleshooting tips:');
            $this->line('  1. Check your .env file configuration');
            $this->line('  2. Ensure database server is running');
            $this->line('  3. Verify credentials are correct');
            $this->line('  4. Check if database exists');
            
            if ($driver === 'mongodb') {
                $this->line('  5. Ensure MongoDB PHP extension is installed');
                $this->line('  6. Check if mongodb/laravel-mongodb package is installed');
            }

            return Command::FAILURE;
        }
    }
}
