import DeviceDetector from "device-detector-js";

export const testSupport = (supportedDevices: { client?: string; os?: string; }[]) => {
    const deviceDetector = new DeviceDetector();
    const detectedDevice = deviceDetector.parse(navigator.userAgent);

    let isSupported = false;
    for (const device of supportedDevices) {
      if (device.client !== undefined) {
        const re = new RegExp(`^${device.client}$`);
        if (!re.test(detectedDevice!.client!.name)) {
          continue;
        }
      }
      if (device.os !== undefined) {
        const re = new RegExp(`^${device.os}$`);
        if (!re.test(detectedDevice!.os!.name)) {
          continue;
        }
      }
      isSupported = true;
      break;
    }
    if (!isSupported) {
      alert(`This demo, running on ${detectedDevice!.client!.name}/${detectedDevice!.os!.name}, ` +
        `is not well supported at this time, continue at your own risk.`);
    }
  }


export const isFullScreen = () =>
document.fullscreenElement?.nodeName === "HTML";

export const allowFullScreen = () =>
document.documentElement.requestFullscreen();

export const exitFullScreen = () => document.exitFullscreen();



