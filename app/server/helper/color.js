export const getRandomColor = () => {
    const minBrightness = 200;
    const maxBrightness = 255;
    const randomChannelValue = () => Math.floor(Math.random() * 256);
    const randomBrightness = () => Math.floor(Math.random() * (maxBrightness - minBrightness)) + minBrightness;
    const rgbaColor = `rgba(${randomChannelValue()}, ${randomChannelValue()}, ${randomChannelValue()}, ${randomBrightness() / 255})`;
    return rgbaColor;
};
