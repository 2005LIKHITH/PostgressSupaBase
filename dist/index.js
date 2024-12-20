"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, city, country, street, pincode } = req.body;
    try {
        // Insert the user
        const { data: userData, error: userError } = yield supabase
            .from('users')
            .insert([{ username, email, password }])
            .select();
        if (userError) {
            console.error("Error inserting user:", userError);
            return res.status(500).json({ message: "Error inserting user", error: userError });
        }
        const userId = userData[0].id;
        // Insert the address linked to the user
        const { data: addressData, error: addressError } = yield supabase
            .from('addresses')
            .insert([{ user_id: userId, city, country, street, pincode }])
            .select();
        if (addressError) {
            console.error("Error inserting address:", addressError);
            return res.status(500).json({ message: "Error inserting address", error: addressError });
        }
        return res.status(200).json({
            message: "User and address added successfully",
            user: userData[0],
            address: addressData[0],
        });
    }
    catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected error occurred" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
