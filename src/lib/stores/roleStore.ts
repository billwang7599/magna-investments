import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of the store's state
interface RoleState {
    role: "founder" | "investor";
    setRole: (role: "founder" | "investor") => void;
}

export const useRoleStore = create<RoleState>()(
    // Use the persist middleware to save the activeRole to localStorage.
    // This ensures the user's choice is remembered across page reloads.
    persist(
        (set) => ({
            role: "founder",

            // Action to set the roles when a user logs in
            setRole: (role: "founder" | "investor") =>
                set(() => ({
                    role,
                })),
        }),
        {
            name: "role-storage", // Name for the localStorage item
            partialize: (state) => ({ role: state.role }),
        },
    ),
);
