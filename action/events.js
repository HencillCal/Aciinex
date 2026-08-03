const welcomegoodbye = process.env.WELCOMEGOODBYE || 'FALSE';
const botname        = process.env.BOTNAME        || 'AciiNex-M 🖤';

const Events = async (client, Nick) => {
  try {
    const metadata        = await client.groupMetadata(Nick.id);
    const participants    = Nick.participants;
    const groupMembersCount = metadata.participants.length;

    for (const num of participants) {
      let dpuser;
      try {
        dpuser = await client.profilePictureUrl(num, 'image');
      } catch {
        dpuser = 'https://files.catbox.moe/m38sqm.jpg';
      }

      if (Nick.action === 'add') {
        const Welcometext =
          `@${num.split('@')[0]} Holla 👋,\n\n` +
          `Welcome to *${metadata.subject}* 🎉\n\n` +
          `👥 Members: ${groupMembersCount}\n` +
          `📜 Please read the group description and follow the rules.\n\n` +
          `Powered by *${botname}* 2025.`;

        if (welcomegoodbye === 'TRUE') {
          await client.sendMessage(Nick.id, {
            image:    { url: dpuser },
            caption:  Welcometext,
            mentions: [num],
          });
        }
      } else if (Nick.action === 'remove') {
        const Lefttext =
          `@${num.split('@')[0]} Goodbye 😔\n\n` +
          `We'll miss you. Come back soon!\n\n` +
          `Powered by *${botname}* 2025.`;

        if (welcomegoodbye === 'TRUE') {
          await client.sendMessage(Nick.id, {
            image:    { url: dpuser },
            caption:  Lefttext,
            mentions: [num],
          });
        }
      }
    }
  } catch (err) {
    console.log('Events error:', err.message);
  }
};

module.exports = Events;
