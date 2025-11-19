<?php
declare(strict_types=1);

use mysqli;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../utils/mailer.php';

$conn = cyberops_get_db_connection();
$conn->set_charset('utf8mb4');
ensure_role_requests_table($conn);
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        handle_get_request($conn);
    } elseif ($method === 'POST') {
        handle_post_request($conn);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function handle_get_request(mysqli $conn): void
{
    if (isset($_GET['all']) && $_GET['all'] === '1') {
        $requests = [];
        $result = $conn->query("SELECT rr.request_id, rr.user_id, rr.requested_role, rr.status, rr.created_at, u.username, u.email
                                FROM role_requests rr
                                JOIN users u ON rr.user_id = u.user_id
                                ORDER BY rr.created_at DESC");

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $requests[] = $row;
            }
        }

        $counts = [
            'total_users' => (int) get_single_value($conn, "SELECT COUNT(*) FROM users"),
            'total_labs' => (int) get_single_value($conn, "SELECT COUNT(*) FROM labs"),
            'pending_role_requests' => (int) get_single_value($conn, "SELECT COUNT(*) FROM role_requests WHERE status = 'pending'"),
        ];

        echo json_encode([
            'success' => true,
            'requests' => $requests,
            'stats' => $counts,
        ]);
        return;
    }

    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
    if ($userId <= 0) {
        echo json_encode(['success' => false, 'message' => 'user_id is required']);
        return;
    }

    $stmt = $conn->prepare("SELECT request_id, user_id, requested_role, status, created_at, updated_at 
                            FROM role_requests WHERE user_id = ? 
                            ORDER BY created_at DESC LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $request = $result->fetch_assoc();
    $stmt->close();

    echo json_encode(['success' => true, 'request' => $request]);
}

function handle_post_request(mysqli $conn): void
{
    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
        return;
    }

    $userId = isset($payload['user_id']) ? (int) $payload['user_id'] : 0;
    $requestedRole = isset($payload['requested_role']) ? strtolower(trim($payload['requested_role'])) : '';

    if ($userId <= 0 || !$requestedRole) {
        echo json_encode(['success' => false, 'message' => 'user_id and requested_role are required']);
        return;
    }

    if (!in_array($requestedRole, ['admin', 'instructor'], true)) {
        echo json_encode(['success' => false, 'message' => 'Invalid role requested']);
        return;
    }

    $userStmt = $conn->prepare('SELECT username, email FROM users WHERE user_id = ? LIMIT 1');
    $userStmt->bind_param('i', $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();
    $userStmt->close();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        return;
    }

    // Upsert into role_requests
    $stmt = $conn->prepare('INSERT INTO role_requests (user_id, requested_role, status)
                            VALUES (?, ?, "pending")
                            ON DUPLICATE KEY UPDATE requested_role = VALUES(requested_role), status = "pending", updated_at = CURRENT_TIMESTAMP');
    $stmt->bind_param('is', $userId, $requestedRole);
    $stmt->execute();
    $stmt->close();

    $request = [
        'user_id' => $userId,
        'requested_role' => $requestedRole,
        'status' => 'pending',
    ];

    $subject = 'New Role Request Submitted';
    $body = sprintf(
        "User %s (%s) has requested the %s role.\n\nReview this request in the admin dashboard.",
        $user['username'],
        $user['email'],
        strtoupper($requestedRole)
    );

    cyberops_send_admin_notification($subject, $body);

    echo json_encode(['success' => true, 'message' => 'Role request submitted', 'request' => $request]);
}

function get_single_value(mysqli $conn, string $sql): ?string
{
    $result = $conn->query($sql);
    if ($result && ($row = $result->fetch_row())) {
        return $row[0];
    }
    return null;
}

function ensure_role_requests_table(mysqli $conn): void
{
    $result = $conn->query("SHOW TABLES LIKE 'role_requests'");
    if ($result && $result->num_rows > 0) {
        return;
    }

    $createSql = <<<SQL
CREATE TABLE IF NOT EXISTS role_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    requested_role ENUM('admin','instructor') NOT NULL,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_role_request_user (user_id),
    CONSTRAINT fk_role_requests_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
SQL;

    if (!$conn->query($createSql)) {
        throw new RuntimeException('Unable to ensure role_requests table: ' . $conn->error);
    }
}

