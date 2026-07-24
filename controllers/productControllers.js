import { validationResult } from "express-validator";
import db from "../config/db.js";
import { baseValidation, updateValidation, verifyCsrf } from "../validations/productsValidation.js";

export const getAllProducts = async(req, res)=>{
    try {
        const sessionMessage = req.session.success;
        delete req.session.success;

        const [products] = await db.query("SELECT * FROM products");
        res.render("products/index", {products, sessionMessage});
    } catch (error) {
        console.error("Error", error)
    }
}

export const showCreate = (req, res)=>{
    try {
        res.render("products/create", {errors: [], formData: {}});
    } catch (error) {
        console.error("Error ", error);
        return res.status(500).send("Internal error");
    }
}

export const createProduct = [
    ...baseValidation, verifyCsrf,
    async (req, res)=>{
        try {
            const {name, description, qty, price} = req.body
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).render("products/create", {errors: errors.mapped(), formData: req.body});
            }

            req.session.success = "New record added successfully";
            await db.query("INSERT INTO products(name, description, quantity, price) VALUES(?, ?, ?, ?)", [name, description, qty, price]);

            res.redirect("/products");
            // res.send("Validations passed")
        } catch (error) {
            console.error("Error ", error);
            return res.status(500).send("Internal server error");
        }
    }
]

export const showEdit = async(req, res)=>{
    const productId = Number(req.params.id)
    try {
        if(isNaN(productId)){
            return res.status(400).send("Invalid ID")
        }
        const [product] = await db.query("SELECT * FROM products WHERE id=?", [productId]);
        if(product.length === 0){
            return res.status(400).send("No record found");
        }
        res.render("products/edit", {errors: [], product: product[0] });
    } catch (error) {
        
    }
}

export const updateProduct = [
    ...updateValidation, verifyCsrf,
    async (req, res)=>{

        const productId = Number(req.params.id);
        const {name, description, qty, price} = req.body;

        try {
            if(isNaN(productId)){
                // return res.status(400).render("products/edit", {errors: {id: {msg: "Invalid ID"}}});
                return res.status(400).send("Invalid ID");
            }

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).render("products/edit", {errors: errors.mapped(), product:{ id: productId, name, description, quantity: qty, price} });
            }

            req.session.success = "Record updated successfully";
            await db.query("UPDATE products SET name=?, description=?, quantity=?, price=? WHERE id=?", [name, description, qty, price, productId]);

            res.redirect("/products");
            // res.send("Validations passed")
        } catch (error) {
            console.error("Error ", error);
            return res.status(500).send("Internal server error");
        }
    }
]

export const deleteProduct = [
    verifyCsrf,
    async(req, res)=>{
    const productId = Number(req.params.id);
    try {
        if(isNaN(productId)){
            return res.status(400).send("Invalid ID");
        }
        await db.query("DELETE FROM products WHERE id=?", [productId]);
        req.session.success = "Record deleted successfully";
        res.redirect("/products");
    } catch (error) {
        console.error("Error ", error);
        return res.status(500).send("Internal server error");
    }
}
];