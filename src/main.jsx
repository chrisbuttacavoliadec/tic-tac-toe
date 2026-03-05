import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TicTacToe from "../game.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <TicTacToe />
    </StrictMode>
);
