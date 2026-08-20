import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// High-resolution SVG with the exact font, tracking, yellow subtitle and white LIONMAX
const svgBuffer = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400" fill="none">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,900&amp;display=swap');
      .title {
        font-family: 'Montserrat', 'Impact', 'Arial Black', sans-serif;
        font-weight: 900;
        font-style: italic;
        font-size: 210px;
        fill: #FFFFFF;
        letter-spacing: -4px;
      }
      .sub {
        font-family: 'Montserrat', 'Arial Black', sans-serif;
        font-weight: 900;
        font-size: 56px;
        fill: #FFEE00;
        letter-spacing: 8px;
      }
    </style>
  </defs>
  
  <!-- LIONMAX in Crisp Pure White -->
  <text 
    x="600" 
    y="220" 
    text-anchor="middle" 
    class="title"
    transform="skewX(-6) translate(20, 0)"
  >
    LIONMAX
  </text>

  <!-- POWDER CAFFEINATED BEVERAGE in Crisp Bright Yellow -->
  <text 
    x="600" 
    y="330" 
    text-anchor="middle" 
    class="sub"
  >
    POWDER CAFFEINATED BEVERAGE
  </text>
</svg>
`);

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pngBuffer = await sharp(svgBuffer, { density: 300 })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'lionmax-logo.png'), pngBuffer);
  fs.writeFileSync(path.join(publicDir, 'lionmax logo pg-01.png'), pngBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), pngBuffer);
  console.log('PNG logo files generated successfully in /public!');
}

generate().catch(console.error);
