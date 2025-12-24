"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveJid = void 0;

const WABinary = require("../WABinary");

async function resolveJid(sock, m, target) {
    if (target === void 0) target = null;

    const input =
        target ||
        (m.mentionedJid && m.mentionedJid[0]) ||
        m.participant ||
        (m.key && (m.key.participant || m.key.remoteJid));

    if (!input)
        return null;

    if (/@s\.whatsapp\.net$/.test(input))
        return input;

    const chat =
        m.chat ||
        (m.key && m.key.remoteJid);

    if (!chat || !chat.endsWith("@g.us"))
        return null;

    const metadata = await sock.groupMetadata(chat);

    const participant = metadata.participants.find(p =>
        WABinary.areJidsSameUser(p.jid, input) ||
        WABinary.areJidsSameUser(p.id, input) ||
        (p.lid && p.lid === input)
    );

    return participant ? participant.jid : null;
}

exports.resolveJid = resolveJid;
