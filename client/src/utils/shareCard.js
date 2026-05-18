import { toPng } from 'html-to-image';

export const downloadDramaCard = async (element, filename = 'filmyaf-drama-card') => {
  if (!element) throw new Error('No element to capture');
  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#0A0A0A',
  });
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
};
