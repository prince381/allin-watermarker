// import { config } from "../../config";
// import { db, storage } from "../../firebase";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

// create a function that generates a random string
// with a given length
const generateRandomString = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

class FFMPEG {
    id: string;
    watermarkPath: string;
    outputPath: string;
    finalVideo: string;

    constructor(id: string) {
        this.id = id;
        this.watermarkPath = path.resolve(__dirname, "../../overlay/allinpod-watermark.png");
        this.outputPath = path.resolve(__dirname, `../../outDir/${this.id}.mp4`);
        this.finalVideo = path.resolve(__dirname, `../../outDir/${this.id}-final.mp4`);
    }

    getVideoData(url: string): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('getting video data from\n', url);
                const videoData = await axios.get(url, {
                    responseType: "arraybuffer",
                });
                console.log('saving file to', this.outputPath)
                fs.writeFile(this.outputPath, videoData.data, async (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("file saved");
                    try {
                        const buffer: Buffer = await this.addWatermark();
                        resolve(buffer);
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private addWatermark(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                console.log("adding watermark");
                ffmpeg(this.outputPath)
                    .input(this.watermarkPath)
                    .complexFilter(
                        [
                            {
                                filter: "overlay",
                                options: {
                                    x: "main_w-overlay_w",
                                    y: "main_h-overlay_h",
                                },
                            },
                        ]
                    )
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
                            fs.readFile(this.finalVideo, async (err, data) => {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                }
                                fs.unlink(this.finalVideo, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                resolve(data);
                            });
                        });
                    })
                    .save(this.finalVideo);
            } catch (error) {
                reject(error);
            }
        });
    }

    // private async saveVideoToFirebase(video_id: string, data: Buffer) {
    //     try {
    //         const file = storage.file(`videopodcast/${video_id}.mp4`);
    //         console.log('saving file to firebase');
    //         await file.save(data, {
    //             metadata: {
    //                 contentType: "video/mp4",
    //             },
    //         });
    //         console.log('file saved to firebase');
    //         const metaData = await file.getMetadata();
    //         const videoUrl = metaData[0].mediaLink;
    //         await db.collection("TalkingPhoto").doc(video_id).update({
    //             id: video_id,
    //             video_url: videoUrl,
    //             video_status: "completed",
    //         });
    //         fs.unlink(this.finalVideo, (err) => {
    //             if (err) {
    //                 console.log(err);
    //                 throw err;
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }
}

export default FFMPEG;