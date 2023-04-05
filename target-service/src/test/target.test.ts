import chai, { expect } from "chai";
import targetValidation from "../validation/target.validation";
import * as z from "zod";

describe("validate target", function () {
  it("should return a valid target object when given valid input", () => {
    // Create mock input data
    const req = {
      user: "Test User",
      files: { image: { size: 1024, mimetype: "image/png" } },
      body: { long: 10.123456, lat: 20.123456 },
    };

    // Call the function and store the result
    const result = targetValidation.validateTarget(req);

    // Assert that the result is a valid target object
    expect(result).to.deep.equal({
      user: "Test User",
      image: { size: 1024, mimetype: "image/png" },
      long: 10.123456,
      lat: 20.123456,
    });
  });
  it("should throw an error when given invalid input", () => {
    // Create mock input data with invalid image type
    const req = {
      user: "Test User",
      files: { image: { size: 1024, mimetype: "image/gif" } },
      body: { long: 10.123456, lat: 20.123456 },
    };

    // Call the function and expect it to throw an error
    expect(() => targetValidation.validateTarget(req)).to.throw(
      z.ZodError,
      /Only .jpg, .jpeg, .png and .webp formats are supported/
    );
  });

  it("should throw an error when given an image that is too large", () => {
    // Create mock input data with image that exceeds the max file size
    const req = {
      user: "Test User",
      files: { image: { size: 10 * 1024 * 1024, mimetype: "image/png" } },
      body: { long: 10.123456, lat: 20.123456 },
    };

    // Call the function and expect it to throw an error
    expect(() => targetValidation.validateTarget(req)).to.throw(
      z.ZodError,
      /Max image size is 5MB/
    );
  });

  it("should throw an error when given missing required fields", () => {
    // Create mock input data with missing required fields
    const req = {
      user: "Test User",
      files: { image: { size: 1024, mimetype: "image/png" } },
      body: { lat: 20.123456 },
    };

    // Call the function and expect it to throw an error
    expect(() => targetValidation.validateTarget(req)).to.throw(z.ZodError);
  });

  it("should throw an error if long is not within range", () => {
    const req = {
      user: "test",
      files: {
        image: {
          size: 2000000,
          mimetype: "image/jpeg",
        },
      },
      body: {
        long: 190,
        lat: 30,
      },
    };

    expect(() => targetValidation.validateTarget(req)).to.throw(
      "long must be between -180 and 180"
    );
  });

  it("should throw an error if lat is not within range", () => {
    const req = {
      user: "test",
      files: {
        image: {
          size: 1024,
          mimetype: "image/jpeg",
        },
      },
      body: {
        long: 10,
        lat: 99,
      },
    };

    expect(() => targetValidation.validateTarget(req)).to.throw(
      "lat must be between -90 and 90"
    );
  });
});
