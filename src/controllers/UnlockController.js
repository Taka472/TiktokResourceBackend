import bcrypt from "bcrypt";

export const unlockController = {
    unlock: async (req, res) => {
        const { password } = req.body;

        const isValid = await bcrypt.compare(
            password,
            process.env.LOCK_PASSWORD_HASH
        );

        if (!isValid) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        res.json({ success: true });
    }
}