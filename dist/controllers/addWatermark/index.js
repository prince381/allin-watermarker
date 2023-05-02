"use strict";
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
const addWatermark_1 = __importDefault(require("../../models/addWatermark"));
const axios_1 = __importDefault(require("axios"));
class AddWatermark {
    addWatermark(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { video_url, video_id, test } = req.body;
                const videoData = yield addWatermark_1.default.getVideoData(video_url);
                // const url = 'http://127.0.0.1:5001/all-in-pod/us-central1/addWaterMarkToVideo';
                const url = 'https://us-central1-all-in-pod.cloudfunctions.net/addWaterMarkToVideo';
                const data = {
                    video_id,
                    video_url,
                    test,
                    video_buffer: videoData
                };
                const response = yield axios_1.default.post(url, data);
                res.status(200).json({
                    status: "success",
                    message: "watermark added",
                    data: response.data
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    status: "error",
                    message: "something went wrong",
                });
            }
        });
    }
}
exports.default = new AddWatermark();
