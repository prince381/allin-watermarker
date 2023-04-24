import { Request, Response } from "express";
import FFMPEG from "../../models/addWatermark";


class AddWatermark {
    async addWatermark(req: Request, res: Response) {
        try {
            const { video_url } = req.body;
            const videoData = await FFMPEG.getVideoData(video_url);
            res.status(200).send(videoData);
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