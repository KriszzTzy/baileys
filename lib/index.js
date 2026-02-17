"use strict";

const chalk = require("chalk");

function rainbowLog(text) {
  const colors = [
    chalk.hex('#FF5252').bold, 
    chalk.hex('#FF9800').bold,    
    chalk.hex('#FFEB3B').bold,    
    chalk.hex('#4CAF50').bold,    
    chalk.hex('#00BCD4').bold,    
    chalk.hex('#2196F3').bold,    
    chalk.hex('#3F51B5').bold,    
    chalk.hex('#9C27B0').bold,    
    chalk.hex('#E91E63').bold, 
    chalk.hex('#FFFFFF').bold     
  ];

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const colorFn = colors[i % colors.length];
    result += colorFn(text[i]);
  }
  console.log(result);
}

rainbowLog('Thank you for using Yuzuki-baileys.\nRead apis api.kriszzyy.xyz')

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWASocket = void 0;
const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;
__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;