export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contact } = req.body;
  if (!contact || !contact.trim()) {
    return res.status(400).json({ error: 'Contact is required' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return res.status(500).json({ error: 'Server config error' });
  }

  const text = `🔔 *Новая заявка RE:AI*\n\n📧 Контакт: ${contact.trim()}\n🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bangkok' })}`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error('Telegram API error:', err);
      return res.status(500).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error sending to Telegram:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
}
