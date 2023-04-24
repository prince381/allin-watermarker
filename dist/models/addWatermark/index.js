"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { config } from "../../config";
// import { db, storage } from "../../firebase";
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
class FFMPEG {
    constructor() {
        this.watermarkPath = path.resolve(__dirname, "../../overlay/watermark.png");
        this.outputPath = path.resolve(__dirname, "../../outDir/video.mp4");
        this.finalVideo = path.resolve(__dirname, "../../outDir/videoWithWatermark.mp4");
    }
    getVideoData(url) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('getting video data from\n', url);
                const videoData = yield axios_1.default.get(url, {
                    responseType: "arraybuffer",
                });
                console.log('saving file to', this.outputPath);
                fs.writeFile(this.outputPath, videoData.data, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("file saved");
                    try {
                        const buffer = yield this.addWatermark();
                        resolve(buffer);
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    addWatermark() {
        return new Promise((resolve, reject) => {
            try {
                console.log("adding watermark");
                (0, fluent_ffmpeg_1.default)(this.outputPath)
                    .input(this.watermarkPath)
                    .complexFilter([
                    {
                        filter: "overlay",
                        options: {
                            x: "main_w-overlay_w",
                            y: "main_h-overlay_h",
                        },
                    },
                ])
                    .on("error", (err) => {
                    console.log("An error occurred: " + err.message);
                    reject(err);
                })
                    .on("end", () => {
                    console.log("Processing finished !");
                    fs.unlink(this.outputPath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("file deleted");
                        fs.readFile(this.finalVideo, (err, data) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            // fs.unlink(this.finalVideo, (err) => {
                            //     if (err) {
                            //         console.log(err);
                            //     }
                            // });
                            resolve(data);
                        }));
                    });
                })
                    .save(this.finalVideo);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.default = new FFMPEG();
