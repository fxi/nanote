# Nanote

Nanote is a lightweight note taking application built with React, Vite and TailwindCSS. Notes are saved to local storage so you can use the app offline.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Desktop

This project is configured to build a desktop application using [Tauri](https://tauri.app/).

### System dependencies

On Linux make sure the following packages are installed before building:

```bash
sudo apt-get install -y build-essential libgtk-3-dev libwebkit2gtk-4.1-dev libsoup-3.0-dev libssl-dev wget curl
```

On macOS you can use Homebrew:

```bash
brew install webkit2gtk gtk+3 libsoup openssl wget curl
```

Install Rust using your preferred method (for example `apt-get install cargo rustc` on Linux or `brew install rust` on macOS).

### Icons

This repository does not include application icons. When building the desktop app,
Tauri will fall back to its default icon. To use a custom icon, create a
`src-tauri/icons` directory with the image files referenced in
`src-tauri/tauri.conf.json`.

### Run in development

```bash
npm run desktop
```

### Build desktop binaries

```bash
npm run desktop:build
```

The application is configured for deployment to GitHub Pages under the `/nanote/` path.
