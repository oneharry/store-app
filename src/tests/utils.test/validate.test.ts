
import { HttpCustomError } from "../../utils/errorUtils";
import { validateProductId } from "../../utils/validateUtils";

describe("Utils validate", () => {
    it("should return the same Id if already trimmed", () => {
        //input with no spaces
        const validProductId = "12345";

        const result = validateProductId(validProductId);

        expect(result).toBe(validProductId);
    });

    it("should return the trimmed Id ", () => {
        // input with extra spaces
        const validProductId = " 12345 ";
        const result = validateProductId(validProductId);

        expect(result).toBe("12345");
    });

    it("should throw an error if Id is empty", () => {

        const invalidProductId = "";

        expect(() => validateProductId(invalidProductId)).toThrow(HttpCustomError);
        expect(() => validateProductId(invalidProductId)).toThrow(new HttpCustomError(400, 'Product ID is required'));
    });

});
