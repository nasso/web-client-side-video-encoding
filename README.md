# web-client-side-blablabla

it seemed so cool to be able to encode videos directly in the web browser
without any server!

## tl;dr

you can, it's okay for really simple stuff, but as soon as you wanna do
something like _SPECIFY THE FRAMERATE_ whilst _MANUALLY REQUESTING FRAMES ONE BY
ONE_, you're out of luck.

oh also, it isn't consistent accross browsers: firefox will produce a video with
a constant framerate and chrome a video with variable framerate. well feel free
to clone/fork and mess with this.

## Building and running

You'll need nodejs with npm installed. I don't know what is the minimum version you'll need so just try with whatever you already have installed and if it doesn't work or if you don't already have it then get the latest LTS.

Clone and install dependencies:
```
git clone https://github.com/nasso/web-client-side-video-encoding.git
cd web-client-side-video-encoding
npm i
```

Then you can run the dev server (useful when coding at the same time because it automatically reloads the page):
```
npm run start
```
It should be open on localhost:8080

If you don't wanna use the dev server just build a bundle using webpack!
```
npm run build
```
The output is in the newly created `dist/` directory.
