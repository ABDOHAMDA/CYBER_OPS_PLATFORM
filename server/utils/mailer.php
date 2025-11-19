<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/../../src/components/auth/vendor/autoload.php';

const CYBEROPS_MAIL_USERNAME = 'deboabdo1234@gmail.com';
const CYBEROPS_MAIL_PASSWORD = 'gjlwqkofrqlyozop';
const CYBEROPS_MAIL_FROM_NAME = 'CYBER_OPS Platform';
const CYBEROPS_ADMIN_EMAIL = 'deboabdo1234@gmail.com';

function cyberops_mailer(): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = CYBEROPS_MAIL_USERNAME;
    $mail->Password = CYBEROPS_MAIL_PASSWORD;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->setFrom(CYBEROPS_MAIL_USERNAME, CYBEROPS_MAIL_FROM_NAME);
    $mail->isHTML(true);
    return $mail;
}

function cyberops_send_admin_notification(string $subject, string $body): bool
{
    try {
        $mail = cyberops_mailer();
        $mail->clearAddresses();
        $mail->addAddress(CYBEROPS_ADMIN_EMAIL);
        $mail->Subject = $subject;
        $mail->Body = nl2br($body);
        $mail->AltBody = strip_tags($body);
        return $mail->send();
    } catch (Exception $e) {
        error_log('Mailer Error: ' . $e->getMessage());
        return false;
    }
}

