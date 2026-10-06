function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function sendBookingStartedEmail({
  to,
  customerName,
  tourName,
  tourDate,
  bookingUrl,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from || !to) {
    console.warn("Correo de reserva omitido: falta configuración de Resend.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Reserva iniciada: ${tourName}`,
        html: `
          <p>Hola ${escapeHtml(customerName)},</p>
          <p>Iniciaste una reserva para <strong>${escapeHtml(tourName)}</strong> el ${escapeHtml(tourDate)}.</p>
          <p>Consulta tu reserva y realiza los pagos pendientes desde este enlace privado:</p>
          <p><a href="${escapeHtml(bookingUrl)}">Consultar mi reserva</a></p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Resend rechazó el correo de reserva.", {
        status: response.status,
      });
      return false;
    }

    return true;
  } catch {
    console.error("No se pudo contactar con Resend para enviar el correo.");
    return false;
  }
}
