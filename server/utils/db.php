<?php
declare(strict_types=1);

use mysqli;

function cyberops_get_db_connection(): mysqli
{
    static $conn = null;

    if ($conn instanceof mysqli) {
        return $conn;
    }

    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $dbname = 'ctf_platform';

    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $conn->connect_error,
        ]);
        exit;
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}

