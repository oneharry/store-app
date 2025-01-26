import { Router } from "express";

const productRouter = Router();

productRouter.post('/products')
productRouter.put('/products/:id')
productRouter.get('/products')
productRouter.get('/products/:id')
productRouter.delete('/products/:id')

export default productRouter;