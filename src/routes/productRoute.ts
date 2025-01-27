import { Router } from "express";
import { addProduct, editProduct, getProduct, getProducts, removeProduct } from "../controllers/productController";
import { Auth } from "../middlewares/authMiddleware";

const productRouter = Router();

productRouter.post('/products', Auth, addProduct);
productRouter.put('/products/:id', Auth, editProduct);
productRouter.get('/products', Auth, getProducts);
productRouter.get('/products/:id', Auth, getProduct);
productRouter.delete('/products/:id', Auth, removeProduct);

export default productRouter;