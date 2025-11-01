import { removeBackground } from "@imgly/background-removal";

self.onmessage = async (event) => {
  const file = event.data;
  try {
    const blob = await Promise.resolve(removeBackground(file));
    self.postMessage({success: true, blob});
  } catch (error) {
    self.postMessage({success: false, error: error.message});
  }
};