// @ts-check
/**
 * Class representing a rendering stage with double-buffered canvas rendering.
 *
 * The Stage manages two canvas elements for smooth rendering by alternating
 * between them—one being displayed while the other is drawn to. Canvases are
 * automatically resized to maintain a fixed aspect ratio relative to the window.
 *
 * This class uses a singleton pattern. Access it via `Stage.instance`.
 *
 * **Features:**
 * - Double buffering using two `<canvas>` elements (`canvas_1`, `canvas_2`)
 * - Responsive resizing based on the window size
 * - Automatic buffer swapping with black clearing
 *
 * **Canvas Role Logic:**
 * - Only one canvas is visible at a time
 * - The hidden canvas is used as the draw buffer (offscreen)
 * - Calling `swapBuffers()` makes the current draw buffer visible
 *
 * @class
 * @singleton
 */
export class Stage {

  /** @private @type { number } */
  _original_width = 256;

  /** @private @type { number } */
  _original_height = 192;

  /** @private @type { number } */
  _aspect_ratio = this._original_width / this._original_height;

  /** @private @type { HTMLCanvasElement[] }  */
  _canvases = [
    /** @type { HTMLCanvasElement } */(document.getElementById('canvas_1')),
    /** @type { HTMLCanvasElement } */(document.getElementById('canvas_2'))
  ];

  /** @private @type { CanvasRenderingContext2D[] } */
  _contexts = [
    /** @type { CanvasRenderingContext2D } */(this._canvases[0].getContext('2d')),
    /** @type { CanvasRenderingContext2D } */(this._canvases[1].getContext('2d'))
  ];

  /** @private @type { number } */
  _inactive_index = 1;

  /** @private @type { Stage } */
  static _instance;

  /** @private */
  constructor() {
    this.resizeCanvas();
    this.swapBuffers();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
  * Get the instance of the stage
  * @returns { Stage }
  */
  static get instance() {
    if (this._instance) return this._instance;
    this._instance = new Stage();
    return this._instance;
  }

  /**
   * Get the back buffer for drawing
   * @returns { CanvasRenderingContext2D }
   */
  get canvas() {
    return this._contexts[this._inactive_index];
  }

  /**
   * Swap buffers
   * @returns { void }
   */
  swapBuffers() {
    const active_index = this._inactive_index;
    this._inactive_index = this._inactive_index === 1 ? 0 : 1;
    const inactive_canvas = this._canvases[this._inactive_index];
    const inactive_context = this._contexts[this._inactive_index];
    const active_canvas = this._canvases[active_index];
    inactive_canvas.style.display = 'none';
    active_canvas.style.display = 'block';
    // reset inactive stage
    inactive_context.clearRect(0, 0, inactive_canvas.width, inactive_canvas.height);
    inactive_context.fillStyle = 'black';
    inactive_context.fillRect(0, 0, inactive_canvas.width, inactive_canvas.height);
  }

  /**
   * Resize the canvas to 80% of the container
   * @private
   * @returns { void }
   */
  resizeCanvas() {
    let containerWidth = window.innerWidth * 0.8; // Use 80% of window width
    let containerHeight = window.innerHeight * 0.8; // Use 80% of window height
    let scaledWidth = containerWidth;
    let scaledHeight = containerWidth / this._aspect_ratio;

    if (scaledHeight > containerHeight) {
      scaledHeight = containerHeight;
      scaledWidth = containerHeight * this._aspect_ratio;
    }

    this._canvases.forEach(element => {
      element.style.width = `${scaledWidth}px`;
      element.style.height = `${scaledHeight}px`;
    });
  }
}

