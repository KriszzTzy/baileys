"use strict";
/**
 * Signal Group Key Helper
 * Helper functions to generate sender keys and signing keys safely.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));

var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});

var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSenderKey = generateSenderKey;
exports.generateSenderKeyId = generateSenderKeyId;
exports.generateSenderSigningKey = generateSenderSigningKey;

const nodeCrypto = __importStar(require("crypto"));
const curve_1 = require("libsignal/src/curve"); 

/**
 * Generates a random 32-byte Sender Key.
 * @returns {Buffer} The generated key.
 */
function generateSenderKey() {
    const key = nodeCrypto.randomBytes(32);
    if (key.length !== 32) {
        throw new Error("Failed to generate a valid 32-byte Sender Key");
    }
    return key;
}

/**
 * Generates a random Sender Key ID.
 * @returns {number} The generated Key ID.
 */
function generateSenderKeyId() {
    const id = nodeCrypto.randomInt(2147483647);
    if (!id || typeof id !== 'number') {
        throw new Error("Failed to generate Sender Key ID");
    }
    return id;
}

/**
 * Generates a Sender Signing Key Pair.
 * Uses libsignal's curve implementation.
 * @param {Object} [key] Optional existing key pair.
 * @returns {Object} The key pair (public/private).
 */
function generateSenderSigningKey(key) {
    if (!key) {
        key = (0, curve_1.generateKeyPair)();
    }

    if (!key || !key.pubKey || !key.privKey) {
        throw new Error("Invalid KeyPair generated from Curve");
    }
    return {
        public: key.pubKey, 
        private: key.privKey
    };
}
