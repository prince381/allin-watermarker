import { Request, Response } from "express";
import FFMPEG from "../../models/addWatermark";
import axios from "axios";


class AddWatermark {
    async addWatermark(req: Request, res: Response) {
        try {
            const { video_url, video_id, test } = req.body;
            const videoData = await FFMPEG.getVideoData(video_url);
            // const url = 'http://127.0.0.1:5001/all-in-pod/us-central1/addWaterMarkToVideo';
            const url = 'https://us-central1-all-in-pod.cloudfunctions.net/addWaterMarkToVideo'
            const data = {
                video_id,
                video_url,
                test,
                video_buffer: videoData
            };

            const response = await axios.post(url, data);
            res.status(200).json({
                status: "success",
                message: "watermark added",
                data: response.data
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "something went wrong",
            });
        }
    }
}

export default new AddWatermark();