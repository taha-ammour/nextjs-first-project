
export const getDominantColors = (imgSrc: string, colorCount = 3): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgSrc;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        if (!context) {
          reject('Could not get canvas context');
          return;
        }
  
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
  
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        const colorCounts: { [color: string]: number } = {};
        let dominantColors: string[] = [];
        const colorArray: { color: string, count: number }[] = [];
  
        for (let i = 0; i < data.length; i += 4) {
          const color = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
  
          if (colorCounts[color]) {
            colorCounts[color]++;
          } else {
            colorCounts[color] = 1;
          }
        }
  
        for (const color in colorCounts) {
          colorArray.push({ color, count: colorCounts[color] });
        }
  
        colorArray.sort((a, b) => b.count - a.count);
  
        dominantColors = colorArray.slice(0, colorCount).map(c => c.color);
  
        resolve(dominantColors);
      };
  
      img.onerror = (err) => {
        reject(err);
      };
    });
  };
  export const isColorBright = (color: string): boolean => {
    const rgb = color.replace(/[^\d,]/g, '').split(',').map(Number);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 160; 
  };