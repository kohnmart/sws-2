export const getRandomColor = () => {
    const minBrightness = 100; // Minimum brightness to ensure good contrast
    const maxBrightness = 220; // Maximum brightness
    const randomChannelValue = () => Math.floor(Math.random() * 256);
    const randomBrightness = () => Math.floor(Math.random() * (maxBrightness - minBrightness)) + minBrightness;
    const rgbaColor = `rgba(${randomChannelValue()}, ${randomChannelValue()}, ${randomChannelValue()}, ${randomBrightness() / 255})`;
    return rgbaColor;
};
