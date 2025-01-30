import { HttpCustomError } from "./errorUtils";

// validate productId
export const validateProductId = (productId: string) => {
    if (!productId) {
        throw new HttpCustomError(400, 'Product ID is required');
    }
    return productId.trim();
};