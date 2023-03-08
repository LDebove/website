/// <reference lib="webworker" />

import { removeColorTransparency, getUniqueColors, replaceLeastUsedColors, addOutline } from './editor.functions';

addEventListener('message', ({ data }) => {
  let response;
  switch(data.function) {
    case 'removeColorTransparency':
      response = removeColorTransparency(data.params[0]);
    break;

    case 'getUniqueColors':
      response = getUniqueColors(data.params[0]);
    break;

    case 'replaceLeastUsedColors':
      response = replaceLeastUsedColors(data.params[0], data.params[1], data.params[2]);
    break;

    case 'addOutline':
      response = addOutline(data.params[0], data.params[1], data.params[2], data.params[3]);
    break;

    default:
    break;
  }
  postMessage({ function: data.function, response: response });
});
