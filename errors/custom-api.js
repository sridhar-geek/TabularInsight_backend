class CustomAPIError extends Error {
  constructor(message) {
    super(message)
  }
}

export default CustomAPIError;

// main error class which other class extended 
