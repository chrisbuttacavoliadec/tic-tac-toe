import { useState } from "react";

const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const RAINBOW_CSS = `
    @keyframes rainbow-bg {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes rainbow-text {
        0%   { color: #ff0000; }
        16%  { color: #ff8800; }
        33%  { color: #ddcc00; }
        50%  { color: #00bb44; }
        66%  { color: #0088ff; }
        83%  { color: #aa00ff; }
        100% { color: #ff0000; }
    }
    .rainbow-bg {
        background: linear-gradient(-45deg, #ff0000, #ff8800, #ddcc00, #00bb44, #0088ff, #aa00ff, #ff00cc, #ff0000) !important;
        background-size: 400% 400% !important;
        animation: rainbow-bg 4s ease infinite;
    }
    .rainbow-text {
        animation: rainbow-text 2s linear infinite;
    }
`;


function checkWinner(board) {
    for (const [a, b, c] of WINNING_COMBOS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: [a, b, c] };
        }
    }
    return null;
}


export default function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [isRainbow, setIsRainbow] = useState(false);

    const result = checkWinner(board);
    const winner = result?.winner;
    const winLine = result?.line || [];
    const isDraw = !winner && board.every(Boolean);

    const handleClick = (i) => {
        if (board[i] || winner) return;
        const next = board.slice();
        next[i] = xIsNext ? "X" : "O";
        setBoard(next);
        const newResult = checkWinner(next);
        if (newResult) {
            setScores(s => ({ ...s, [newResult.winner]: s[newResult.winner] + 1 }));
        }
        setXIsNext(!xIsNext);
    };

    const reset = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    const status = winner
        ? `${winner} wins!`
        : isDraw
            ? "It's a draw!"
            : `${xIsNext ? "X" : "O"}'s turn`;

    const getCellBg = (cell, isWinCell) => {
        if (isRainbow) return isWinCell ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)";
        return isWinCell ? (cell === "X" ? "#3d1a19" : "#192838") : "#1a1a1a";
    };

    const getCellHoverBg = () => isRainbow ? "rgba(255,255,255,0.95)" : "#222";

    const btnBorderColor = isRainbow ? "rgba(255,255,255,0.6)" : "#333";
    const btnBorderHover = isRainbow ? "rgba(255,255,255,1)" : "#666";
    const btnTextColor = isRainbow ? "rgba(255,255,255,0.8)" : "#666";
    const btnTextHover = isRainbow ? "#fff" : "#ccc";

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: RAINBOW_CSS }} />
            <div
                className={isRainbow ? "rainbow-bg" : ""}
                style={{
                    minHeight: "100vh",
                    background: isRainbow ? undefined : "#0f0f0f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Courier New', monospace",
                }}
            >
                <div style={{ textAlign: "center", userSelect: "none" }}>

                    {/* Title */}
                    <div
                        className={isRainbow ? "rainbow-text" : ""}
                        style={{
                            fontSize: "11px",
                            letterSpacing: "6px",
                            color: isRainbow ? undefined : "#444",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                        }}
                    >
                        Tic Tac Toe
                    </div>

                    {/* Score */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "40px",
                        marginBottom: "32px",
                    }}>
                        {["X", "O"].map(p => (
                            <div key={p} style={{
                                textAlign: "center",
                                opacity: (!winner && !isDraw && (xIsNext ? p === "X" : p === "O")) ? 1 : 0.4,
                                transition: "opacity 0.3s",
                            }}>
                                <div
                                    className={isRainbow ? "rainbow-text" : ""}
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "bold",
                                        color: isRainbow ? undefined : (p === "X" ? "#e74c3c" : "#3498db"),
                                        marginBottom: "2px",
                                    }}
                                >{p}</div>
                                <div
                                    className={isRainbow ? "rainbow-text" : ""}
                                    style={{
                                        fontSize: "28px",
                                        color: isRainbow ? undefined : "#fff",
                                        fontWeight: "bold",
                                    }}
                                >{scores[p]}</div>
                            </div>
                        ))}
                    </div>

                    {/* Board */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 100px)",
                        gridTemplateRows: "repeat(3, 100px)",
                        gap: "4px",
                        marginBottom: "28px",
                    }}>
                        {board.map((cell, i) => {
                            const isWinCell = winLine.includes(i);
                            const bg = getCellBg(cell, isWinCell);
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleClick(i)}
                                    className={isRainbow && cell ? "rainbow-text" : ""}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        background: bg,
                                        border: isRainbow ? "2px solid rgba(255,255,255,0.4)" : "1px solid #2a2a2a",
                                        borderRadius: "8px",
                                        fontSize: "40px",
                                        fontWeight: "bold",
                                        color: isRainbow ? undefined : (cell === "X" ? "#e74c3c" : "#3498db"),
                                        cursor: cell || winner ? "default" : "pointer",
                                        transition: "background 0.2s, transform 0.1s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        outline: "none",
                                    }}
                                    onMouseEnter={e => {
                                        if (!cell && !winner) e.currentTarget.style.background = getCellHoverBg();
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = bg;
                                    }}
                                >
                                    {cell}
                                </button>
                            );
                        })}
                    </div>

                    {/* Status */}
                    <div
                        className={isRainbow ? "rainbow-text" : ""}
                        style={{
                            fontSize: "16px",
                            color: isRainbow ? undefined : (winner ? (winner === "X" ? "#e74c3c" : "#3498db") : "#888"),
                            marginBottom: "20px",
                            letterSpacing: "2px",
                            minHeight: "24px",
                        }}
                    >
                        {status}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        <button
                            onClick={reset}
                            style={{
                                background: "transparent",
                                border: `1px solid ${btnBorderColor}`,
                                color: btnTextColor,
                                padding: "10px 28px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = btnBorderHover;
                                e.currentTarget.style.color = btnTextHover;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = btnBorderColor;
                                e.currentTarget.style.color = btnTextColor;
                            }}
                        >
                            New Game
                        </button>

                        <button
                            onClick={() => setIsRainbow(r => !r)}
                            style={{
                                background: "transparent",
                                border: `1px solid ${btnBorderColor}`,
                                color: btnTextColor,
                                padding: "10px 20px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = btnBorderHover;
                                e.currentTarget.style.color = btnTextHover;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = btnBorderColor;
                                e.currentTarget.style.color = btnTextColor;
                            }}
                        >
                            {isRainbow ? "Dark" : "Rainbow"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
