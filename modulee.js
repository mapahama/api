
import { code0 } from './config.js';
sendDataToNonModule();

function sendDataToNonModule() {
  window.sharedData = code0;
}

