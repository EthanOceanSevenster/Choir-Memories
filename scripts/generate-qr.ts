import QRCode from "qrcode";
import path from "path";

const baseUrl =
  process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const token = process.argv[3] || process.env.ACCESS_TOKEN || "";
const url = token ? `${baseUrl}/api/auth/grant?token=${token}` : baseUrl;
const outputPath = path.join(process.cwd(), "public", "qr-code.png");

async function main() {
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  console.log(`QR code generated at ${outputPath} for URL: ${url}`);
}

main().catch(console.error);
