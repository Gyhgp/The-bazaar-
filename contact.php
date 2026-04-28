<?php
$method = $_SERVER['REQUEST_METHOD'] ?? '';

function get_post($key, $default = '') {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : $default;
}

function h($value) {
  return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

$nombre = get_post('nombre');
$correo = get_post('correo');
$celular = get_post('celular');
$mensaje = get_post('mensaje');

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$uri = $_SERVER['REQUEST_URI'] ?? '';
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Respuesta | The Bazaar</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <main style="max-width:900px;margin:0 auto;padding:22px 18px 70px;">
    <section class="chronicles">
      <div class="section-head section-head--tight">
        <div class="section-kicker">&lt;php&gt;</div>
        <h1 class="section-title">RESPUESTA DEL SERVIDOR</h1>
        <p class="section-subtitle">Procesamiento del formulario con <strong>POST</strong>, usando <strong>$_POST</strong> y <strong>$_SERVER</strong>.</p>
      </div>

      <div class="panel" style="max-width:820px;">
        <?php if ($method !== 'POST'): ?>
          <div class="panel-title">Solicitud inválida</div>
          <p class="panel-text">Este endpoint espera datos enviados desde el formulario usando el método <strong>POST</strong>.</p>
          <p class="panel-text"><a class="footer-link" href="index.html#contacto">Volver al formulario</a></p>
        <?php else: ?>
          <div class="panel-title">Gracias por contactarme, <?php echo h($nombre ?: 'visitante'); ?>.</div>

          <div class="section-kicker" style="margin-top:12px;">Datos recibidos ($_POST)</div>
          <div style="margin-top:10px;line-height:1.5;color:rgba(235,225,200,.80);">
            <div><strong>Nombre:</strong> <?php echo h($nombre); ?></div>
            <div><strong>Correo:</strong> <?php echo h($correo); ?></div>
            <div><strong>Celular:</strong> <?php echo h($celular ?: 'No proporcionado'); ?></div>
            <div style="margin-top:10px;"><strong>Mensaje:</strong><br /><?php echo nl2br(h($mensaje)); ?></div>
          </div>

          <div class="section-kicker" style="margin-top:14px;">Datos del servidor ($_SERVER)</div>
          <div style="margin-top:10px;line-height:1.5;color:rgba(235,225,200,.80);">
            <div><strong>Método:</strong> <?php echo h($method); ?></div>
            <div><strong>URI:</strong> <?php echo h($uri); ?></div>
            <div><strong>IP:</strong> <?php echo h($ip); ?></div>
            <div><strong>User-Agent:</strong> <?php echo h($userAgent); ?></div>
          </div>

          <p class="panel-text" style="margin-top:14px;"><a class="footer-link" href="index.html#contacto">Volver al formulario</a></p>
        <?php endif; ?>
      </div>
    </section>
  </main>
</body>
</html>
