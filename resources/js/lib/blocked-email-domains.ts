export const BLOCKED_EMAIL_DOMAINS = [
    // Google
    'gmail.com', 'googlemail.com',
    // Microsoft
    'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
    // Yahoo
    'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.es', 'ymail.com',
    // Apple
    'icloud.com', 'me.com', 'mac.com',
    // AOL / legacy
    'aol.com', 'aim.com',
    // Privacy-focused consumer
    'protonmail.com', 'proton.me', 'pm.me', 'tutanota.com', 'tuta.io',
    // Other consumer
    'gmx.com', 'gmx.net', 'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru',
    'fastmail.com', 'hushmail.com', 'inbox.com', 'rocketmail.com',
    // Disposable
    'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'temp-mail.org',
    'throwawaymail.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com',
];

export function isBlockedEmailDomain(email: string): boolean {
    const at = email.lastIndexOf('@');
    if (at === -1) return false;
    const domain = email.slice(at + 1).toLowerCase().trim();
    return BLOCKED_EMAIL_DOMAINS.includes(domain);
}