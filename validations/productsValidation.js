import { body } from "express-validator";

export const baseValidation = [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("qty").trim().notEmpty().withMessage("Quantity is required").isInt().withMessage("Quantity must be number greater than 0"),
    body("price").trim().notEmpty().withMessage("Product price is required").isFloat().withMessage("Price must be number"),
];

export const updateValidation = [
    ...baseValidation, 
    body("description").trim().notEmpty().withMessage("Description is required")
]

// csrf
export function verifyCsrf(req, res, next){
    const token = req.body._csrf;
    if(!token || token !== req.session.csrfToken){
        return res.status(403).send("Invalid CSRF Token");
    }
    next();
}