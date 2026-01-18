# LuminaLink: Ultrasound Data Uplink 📡🔊

LuminaLink is an experimental project that explores the transmission of data through sound. Using ultrasonic frequencies (18-22kHz), it allows devices to exchange information without the need for Wi-Fi, Bluetooth, or cables—just using the speakers and microphone.

This project is built on top of [ggwave](https://github.com/ggerganov/ggwave), implementing a modern, "cyber-industrial" interface with Next.js and Tailwind CSS.

## 🚀 What can it do?

Imagine being able to "ping" a message or a small piece of data to a nearby device simply by playing a sound that the human ear can barely perceive.

- **Ultrasonic Transmission:** Uses frequencies above the typical human hearing range.
- **Cross-Platform:** Works on any device with a browser, microphone, and speakers.
- **No Pairing Needed:** Unlike Bluetooth, there is no handshake process. If you can hear it, you can receive it.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Framer Motion for animations
- **Core Engine:** ggwave (Data-over-Audio)
- **Icons:** Lucide React
- **Language:** TypeScript

## 🏁 Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, or Safari recommended).
- **HTTPS is required** for microphone access in most browsers (except for `localhost`).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ismaeliki11/ultrasounds.git
   cd ultrasounds
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to use

### 📤 Transmitting Data
1. Open the **Transmitter** tab.
2. Enter the message you want to send.
3. Pulse the **Transmit** button. You might hear a very faint high-pitched "chirp" or nothing at all depending on your speakers.

### 📥 Receiving Data
1. Open the **Receiver** tab on a different device (or the same one for testing).
2. Click **Activate Receiver** and allow microphone access.
3. When a signal is detected, the message will appear in the log.

## ⚠️ Important Note

For best results, keep the devices relatively close to each other and minimize background noise in the ultrasonic range. High-quality microphones and speakers will significantly improve the data transfer reliability.

---
*Created with ❤️ by [Ismael](https://github.com/Ismaeliki11)*
