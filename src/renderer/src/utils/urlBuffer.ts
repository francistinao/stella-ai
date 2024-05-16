export const urlBuffer = async (imageData: any): Promise<string> => {
    try {
      const imageDataArrayBuffer = await imageData; 
      const blob = new Blob([imageDataArrayBuffer], { type: 'image/jpeg' }); 
      const url = URL.createObjectURL(blob);
      
      return url

    } catch (error) {
      console.error('Error loading image data:', error);
    }
  };