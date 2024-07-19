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
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Ampelsystem / Wiki - QR Code Generator – Sternenlabor</title>
</head>

<body>

    <div id="qr-code-generator">
        <h1>Ampelsystem / Wiki -  QR Code Generator</h1>

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
                <div id="preview-box">
                    <div id="box" data-title="Vorschau"></div>
                </div>

                <h3 id="settings-title">QR Code Settings</h3>
                <div class="set" id="color-set">

                    <label for="color-select">Farbe</label>

                    <input id="color-select" type="color" value="#ff0000" list="predefined" />
                    <datalist id="predefined">
                        <option>#ff0000</option>
                        <option>#fff000</option>
                        <option>#00ff00</option>
                    </datalist>

                </div>
                <div class="set" id="url-set">
                    <label for="url">Wiki URL</label>
                    <textarea id="url" rows="4"></textarea>
                </div>

                <div class="btn" id="download-svg">Download QR Code als SVG</div>
            </div>

        <?php endif; ?>

    </div>

    <link rel="stylesheet" href="./styles/style.css" type="text/css" media="all" />

    <?php if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) : ?>
        <script src="./scripts/qrcode.min.js"></script>
        <script src="./scripts/main.mjs" type="module"></script>
    <?php endif; ?>
</body>

</html>