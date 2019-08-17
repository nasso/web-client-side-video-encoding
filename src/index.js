// global style sheet
import "./index.scss";

// other imports
import StreamSaver from "streamsaver";
import Renderer from "./renderer";
import DOMConsole from "./domconsole";

const recordingFormat = [
    { ext: "mp4", mime: "video/mp4\;codecs=h264" },
    { ext: "mp4", mime: "video/mp4" },
    { ext: "webm", mime: "video/webm\;codecs=vp8" },
    { ext: "webm", mime: "video/webm" },
];

// create the DOMConsole instance
const domconsole = new DOMConsole(document.getElementById("console"));

// start button
const startRecordingBtn = document.getElementById("start-recording-btn");

// canvas
const cvs = document.getElementById("canvas");
cvs.width = 640;
cvs.height = 480;

// video
const vid = document.getElementById("video");

// renderer
const renderer = new Renderer(cvs);

// drawing stuff
renderer.start();

async function startRecording() {
    startRecordingBtn.disabled = true;

    let writingQueue = Promise.resolve();
    let chunkCount = 0;
    let usedFormat = null;
    let fileStream = null;
    let writer = null;
    let stream = null;
    let recorder = null;

    domconsole.println("Checking for available formats...");
    for(let format of recordingFormat) {
        domconsole.print(`Checking type ${format.mime}...`);

        if(MediaRecorder.isTypeSupported(format.mime)) {
            domconsole.println(" supported");

            if(usedFormat === null) {
                usedFormat = format;
            }
        } else {
            domconsole.println(" unsupported");
        }
    }

    if(usedFormat === null) {
        domconsole.println("No available format could be found. Aborting.");
        startRecordingBtn.disabled = false;
        return;
    }

    async function recorderDataAvailable(e) {
        chunkCount++;

        let thisChunk = chunkCount;
        domconsole.println(`Processing chunk ${thisChunk}...`);

        writingQueue = writingQueue.then(() => new Promise(resolve => {
            new Response(e.data).arrayBuffer().then(buffer => {
                let uint8Array = new Uint8Array(buffer);
                writer.write(uint8Array);

                domconsole.println(`Chunk ${thisChunk} processed.`);

                resolve();
            });
        }));
    }

    async function recorderStopped(e) {
        domconsole.println("Recorder has been stopped.");

        domconsole.println("Waiting for the writing queue...");
        await writingQueue;

        domconsole.print("Closing writer...");
        writer.close();
        domconsole.println(" ok");

        domconsole.println("Done.");
        startRecordingBtn.disabled = false;
    }

    domconsole.print("Stopping renderer...");
    await renderer.stop();
    domconsole.println(" ok");

    domconsole.print("Creating write stream...");
    fileStream = StreamSaver.createWriteStream(`test.${usedFormat.ext}`);
    writer = fileStream.getWriter();
    domconsole.println(" ok");

    domconsole.print("Getting the canvas capture stream...");
    stream = cvs.captureStream();
    domconsole.println(" ok");

    domconsole.print("Creating the MediaRecorder instance...");
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = recorderDataAvailable;
    recorder.onstop = recorderStopped;
    domconsole.println(" ok");

    domconsole.print("Starting the recorder...");
    recorder.start(1000);
    domconsole.println(" ok");

    domconsole.println("Rendering 300 frames at 60 FPS...")
    await renderer.start(60, 300);
    
    domconsole.println("Stopping the recorder...");
    recorder.stop();
}

// wait for the user to click on the button
startRecordingBtn.onclick = startRecording;
