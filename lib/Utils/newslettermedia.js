"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getWAUploadToServerNewsletter = exports.prepareWAMessageMediaNewsletter = exports.getRawMediaUploadDataNewsletter = void 0;

const crypto_1 = require("crypto");
const boom_1 = require("@hapi/boom");
const WAProto_1 = require("../../WAProto");
const axios_1 = require("axios");
const Defaults_1 = require("../Defaults");

function getRawMediaUploadDataNewsletter(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new boom_1.Boom("Newsletter media must be Buffer");
    }
    const fileSha256 = (0, crypto_1.createHash)("sha256").update(buffer).digest();
    return {
        buffer,
        fileSha256,
        fileLength: buffer.length
    };
}
exports.getRawMediaUploadDataNewsletter = getRawMediaUploadDataNewsletter;

function getWAUploadToServerNewsletter({ customUploadHosts = [], fetchAgent, logger, options = {} }, refreshMediaConn) {
    return async (buffer, { mediaType, fileEncSha256B64 }) => {
        if (!Buffer.isBuffer(buffer)) {
            throw new boom_1.Boom("Upload expects Buffer");
        }
        let uploadInfo = await refreshMediaConn(false);
        const hosts = [...customUploadHosts, ...uploadInfo.hosts];
        let urls;
        for (const { hostname, maxContentLengthBytes } of hosts) {
            const auth = encodeURIComponent(uploadInfo.auth);
            let mediaPath = Defaults_1.MEDIA_PATH_MAP[mediaType];
            if (!mediaPath) {
                mediaPath = "/newsletter/newsletter-image";
            } else {
                mediaPath = mediaPath.replace("/mms/", "/newsletter/newsletter-");
            }
            const url = `https://${hostname}${mediaPath}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`;
            try {
                if (maxContentLengthBytes && buffer.length > maxContentLengthBytes) {
                    throw new boom_1.Boom("Body too large", { statusCode: 413 });
                }
                const res = await axios_1.default.post(url, buffer, {
                    ...options,
                    headers: {
                        "Content-Type": "application/octet-stream",
                        Origin: Defaults_1.DEFAULT_ORIGIN,
                        ...(options.headers || {})
                    },
                    httpsAgent: fetchAgent,
                    responseType: "json",
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                });
                const result = res.data;
                if (result?.url || result?.direct_path) {
                    urls = {
                        mediaUrl: result.url,
                        directPath: result.direct_path
                    };
                    break;
                }
                uploadInfo = await refreshMediaConn(true);
            } catch (err) {
                logger?.warn?.({ err }, `Newsletter upload failed on ${hostname}`);
            }
        }
        if (!urls) {
            throw new boom_1.Boom("Newsletter media upload failed", { statusCode: 500 });
        }
        return urls;
    };
}
exports.getWAUploadToServerNewsletter = getWAUploadToServerNewsletter;

async function prepareWAMessageMediaNewsletter(message, options) {
    if (!options || typeof options.upload !== "function") {
        throw new boom_1.Boom("upload function is required");
    }
    const mediaType = Object.keys(message || {})[0];
    if (!mediaType) {
        throw new boom_1.Boom("Invalid newsletter media");
    }
    const buffer = message[mediaType];
    if (!Buffer.isBuffer(buffer)) {
        throw new boom_1.Boom("Newsletter media must be Buffer");
    }
    const uploadData = getRawMediaUploadDataNewsletter(buffer);
    const uploaded = await options.upload(buffer, {
        mediaType,
        fileEncSha256B64: uploadData.fileSha256.toString("base64"),
        newsletter: true
    });
    const proto = {};
    proto[`${mediaType}Message`] = {
        url: uploaded.mediaUrl,
        directPath: uploaded.directPath,
        fileSha256: uploadData.fileSha256,
        fileLength: uploadData.fileLength,
        mimetype: options.mimetype
    };
    if (mediaType === "video") {
        proto.videoMessage.ptv = true;
    }
    return WAProto_1.WAProto.Message.fromObject(proto);
}
exports.prepareWAMessageMediaNewsletter = prepareWAMessageMediaNewsletter;
