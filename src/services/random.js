// @ts-check
/** 
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *   **R A N D O M  N U M B E R  G E N E R A T O R**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * General Puropose Random Number
 * by the Polynominal Method.
 *
 * This is a replica of the random number generator
 * found in Dungeons of Dagoroth
 *
 * Example usage:
 * ``` javascript
 * const rng = Random.instance;
 * rng.seed = 12345;
 * const randomValue = rng.number;
 * ```
 *
 * @class
 * @singleton
 */
export class Random {
  /** @private @type { Random } static instance variable */
  static _instance;

  /** @private seed variable - 24 bits stored as 3 bytes */
  _seed = [0, 0, 0];

  /** @private constructor to enforce singleton pattern */
  constructor() {
    // Initialize with some default value
    this.seed = Date.now() & 0xFFFFFF;
  }

  /**
   * Get the singleton instance
   * @returns {Random} The singleton Random instance
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new Random();
    }
    return this._instance;
  }

  /**
   * Set the seed for the random number generator
   * @param {number} value - A 24-bit number to use as seed
   * @return { Random }
   */
  set seed(value) {
    // Ensure value is a 24-bit number
    value = value & 0xFFFFFF;

    // Break into 3 bytes
    this._seed[0] = value & 0xFF;         // SEED (lowest byte)
    this._seed[1] = (value >> 8) & 0xFF;  // SEED+1 (middle byte)
    this._seed[2] = (value >> 16) & 0xFF; // SEED+2 (highest byte)
  }

  /**
   * Generate a random number using the same algorithm as the assembly code
   * @returns {number} A random number between 0 and 255
   */
  get number() {
    // Perform 8 shifts of the 24-bit value
    for (let x = 0; x < 8; x++) {
      // Clear feedback byte
      let b = 0;

      // Load byte containing feedback bits and mask all except feedback bits
      let a = this._seed[2] & 0xE1; // 11100001 in binary

      // Count number of 1 bits in the masked value
      for (let y = 0; y < 8; y++) {
        if ((a & 0x80) !== 0) { // If the highest bit is 1
          b++;
        }
        a = (a << 1) & 0xFF; // Shift left, keeping only 8 bits
      }

      // Get the LSB of the count (odd or even)
      const carryBit = b & 1;

      // Perform 24-bit shift with the feedback bit
      let carry = carryBit;

      // Rotate each byte left through carry
      for (let i = 0; i < 3; i++) {
        const newCarry = (this._seed[i] & 0x80) >>> 7;
        this._seed[i] = ((this._seed[i] << 1) & 0xFF) | carry;
        carry = newCarry;
      }
    }

    // Return the lowest byte as the random number
    return this._seed[0];
  }
}

