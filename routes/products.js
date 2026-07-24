import express from "express";
import * as productRoutes from "../controllers/productControllers.js";
const router = express.Router();

router.get("/", productRoutes.getAllProducts);
router.get("/create", productRoutes.showCreate);
router.post("/create", productRoutes.createProduct);
router.get("/edit/:id", productRoutes.showEdit);
router.post("/update/:id", productRoutes.updateProduct);
router.post("/delete/:id", productRoutes.deleteProduct);

export default router;