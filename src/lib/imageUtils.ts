export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to 100x100
        canvas.width = 100;
        canvas.height = 100;
        
        // Draw image centered and scaled to fit
        const scale = Math.max(
          100 / img.width,
          100 / img.height
        );
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const x = (100 - newWidth) / 2;
        const y = (100 - newHeight) / 2;
        
        ctx?.drawImage(img, x, y, newWidth, newHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};