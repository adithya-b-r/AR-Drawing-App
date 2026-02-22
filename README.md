# AR Drawing App 🎨

A sleek, mobile-first web application that overlays your digital sketches onto a live camera feed using Augmented Reality principles. Tracing and practicing your drawing skills has never been easier!

## Features
- **Live Camera Underlay**: Uses the device's camera to display the real world.
- **Image Overlays**: Upload multiple sketches and drag them into perfect position.
- **Individual Controls**: Select an image to independently adjust its scaling, rotation, and opacity.
- **Grayscale Filter**: Instantly convert noisy image backgrounds to B&W for easier tracing.
- **Flashlight & Camera Toggles**: Easily switch between front and rear cameras, and toggle the device torch (if supported).
- **Drag & Drop**: Seamlessly import images on desktop or tablet.

## Tech Stack
Built with modern web technologies for a premium experience:
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **API**: `navigator.mediaDevices` for web camera access

## Future Enhancements 🚀
If you want to take this app further, here are some great ideas to implement next:
1. **Pinch-to-Zoom & Rotate**: Add native touch gesture recognition so users can scale and rotate images by pinching and twisting with two fingers on their touchscreen.
2. **Local Storage Save State**: Automatically save the canvas state (uploaded images, their positions, and active settings) to `localStorage` so users don't lose their work if they accidentally refresh the page.
3. **Perspective Distortion Grid**: Allow users to warp the corners of an overlay image independently to match perspective distortions when a piece of paper isn't perfectly flat or head-on.
4. **Export Merged Canvas**: Add a "Snapshot" feature that captures the current camera frame and burns the overlays into a single downloadable image.
5. **Image Cropping Sub-tool**: Allow users to crop out extraneous margins of their uploaded sketches natively in the app before tracing.
6. **Dark/Light Theme Toggle**: Currently defaulting to a sleek dark UI, building a specific high-contrast light theme could help in bright environments.

## Getting Started
First, clone the repo and install dependencies:
```bash
npm install
```

Then run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
