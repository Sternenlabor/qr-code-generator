<?php
session_start();

// Function to read the configuration file and get the reCAPTCHA secret
function getRecaptchaSecret()
{
    $configFile = 'config.json';
    if (!file_exists($configFile)) {
        die('Configuration file not found');
    }

    $configData = file_get_contents($configFile);
    $config = json_decode($configData, true);

    if (!isset($config['recaptcha_secret'])) {
        die('reCAPTCHA secret not found in configuration file');
    }

    return $config['recaptcha_secret'];
}

$recaptcha_secret = getRecaptchaSecret();
$recaptcha_token = $_POST['g-recaptcha-response'];

function verifyRecaptcha($token, $secret)
{
    $recaptcha_response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$token");
    $recaptcha_data = json_decode($recaptcha_response, true);
    return $recaptcha_data['success'];
}

if (verifyRecaptcha($recaptcha_token, $recaptcha_secret)) {
    $_SESSION['authenticated'] = true;
}

?>
<!DOCTYPE html>
<html lang="de-DE">

<head>
    <title>Ampelsystem / Wiki - QR Code Generator – Sternenlabor</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="stylesheet" href="/src/style.css" media="all" />
</head>

<body>

    <div id="qr-code-generator">
        <h1>Ampelsystem / Wiki - QR Code Generator</h1>

        <div id="logo"></div>

        <?php if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) : ?>

            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            <form action="/" method="POST" id="re-captcha-form">
                <div class="g-recaptcha" data-sitekey="6LdGmBMqAAAAAMplm9mexca5W9m8jU-wRdE9J9v8"></div>
                <br />
                <input type="submit" value="Zum Generator" class="btn">
            </form>

        <?php else : ?>

            <div id="generator">

                <preview-box value="" color="#ff0000" size="25"></preview-box>

                <settings-form url="https://wiki.sternenlabor.de/doku.php?id=bereiche:elektronik:geraete:oszilloskop_ut2042c" color="#ff0000"></settings-form>

                <div class="download-buttons">
                    <div class="btn" id="download-svg">Download QR Code als SVG</div>
                    <div class="btn" id="download-png">Download QR Code als PNG</div>
                </div>

            </div>

        <?php endif; ?>

    </div>

    <?php if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) : ?>
        <script defer src="/src/PreviewBox.mjs" type="module"></script>
        <script defer src="/src/SettingsForm.mjs" type="module"></script>
        <script src="/index.mjs" type="module"></script>
    <?php endif; ?>
</body>

</html>