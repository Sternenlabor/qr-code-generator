<?php

session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    die('Unauthorized request');
}

if (isset($_GET['url'])) {
    $url = filter_var($_GET['url'], FILTER_SANITIZE_URL);

    // Check if the URL is for the short URL API and append the signature
    if (strpos($url, 'https://s.sternenlabor.de/public-api.php?action=shorturl&format=json') === 0) {
        $signature = 'efaf50b091';
        $url .= '&signature=' . $signature;
    }

    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid URL']);
        exit;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true); // Get headers
    curl_setopt($ch, CURLOPT_NOBODY, false); // Also get body

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        http_response_code(500);
        echo json_encode(['error' => 'Request Error:' . curl_error($ch)]);
    } else {
        // Set the HTTP status code
        http_response_code($httpCode);

        // Separate headers and body
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $header_size);
        $body = substr($response, $header_size);

        // Pass through the headers
        $headers = explode("\r\n", $header);
        foreach ($headers as $header) {
            if (!empty($header) && strpos($header, ':') !== false) {
                header($header);
            }
        }

        // Output the body
        echo $body;
    }

    curl_close($ch);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No URL provided']);
}
