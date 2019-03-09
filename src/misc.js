/* eslint-disable import/prefer-default-export */

/**
 * @param {function} callback
 */
export function throttle (callback) {
  let handle = 0;
  return (...args) => {
    cancelAnimationFrame(handle);
    handle = requestAnimationFrame(() => {
      callback(...args);
    });
  };
}
