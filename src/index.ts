import { createClient } from '@supabase/supabase-js';
import express, { Request, Response } from 'express';
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;



const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
app.use(express.json());

app.post('/signup', async (req: Request, res: Response):Promise<any> =>  {
    const { username, email, password, city, country, street, pincode } = req.body;

    try {
        // Insert the user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{ username, email, password }])
            .select();

        if (userError) {
            console.error("Error inserting user:", userError);
            return res.status(500).json({ message: "Error inserting user", error: userError });
        }

        const userId = userData[0].id;

        // Insert the address linked to the user
        const { data: addressData, error: addressError } = await supabase
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
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected error occurred" });
    }
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
