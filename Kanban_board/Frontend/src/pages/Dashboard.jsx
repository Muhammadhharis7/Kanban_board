import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const navigate = useNavigate();

    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newBoardTitle, setNewBoardTitle] = useState("");
    const [newBoardDescription, setNewBoardDescription] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        api
            .get("/boards")
            .then((response) => {
                setBoards(response.data.data);
            })
            .catch((err) => {
                const message =
                    err.response?.data?.message || "Failed to load boards";
                setError(message);
                // if the token is invalid/expired, send them back to login
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        try {
            setCreating(true);
            const response = await api.post("/boards", {
                title: newBoardTitle,
                description: newBoardDescription,
            });
            setBoards((prev) => [...prev, response.data.data]);
            setNewBoardTitle("");
            setNewBoardDescription("");
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to create board";
            setError(message);
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
        } catch (err) {
            console.log("Logout error:", err.response?.data || err.message);
        } finally {
            // navigate("/login");
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Your Boards</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-white-400 hover:text-white underline bg-red-600 px-1 py-1 rounded"
                    >
                        Log out
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-900/40 border border-red-700 px-4 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Create new board form */}
                <form
                    onSubmit={handleCreateBoard}
                    className="mb-8 bg-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row gap-3"
                >
                    <input
                        type="text"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        placeholder="New board title"
                        className="flex-1 rounded-md bg-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={newBoardDescription}
                        onChange={(e) => setNewBoardDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="flex-1 rounded-md bg-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium disabled:opacity-50"
                    >
                        {creating ? "Creating..." : "Create board"}
                    </button>
                </form>

                {/* Boards list */}
                {loading ? (
                    <p className="text-zinc-400">Loading boards...</p>
                ) : boards.length === 0 ? (
                    <p className="text-zinc-400">
                        You don't have any boards yet — create one above to get started.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <div
                                key={board._id}
                                onClick={() => navigate(`/boards/${board._id}`)}
                                className="bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 cursor-pointer transition-colors"
                            >
                                <h2 className="font-semibold text-lg mb-1">{board.title}</h2>
                                {board.description && (
                                    <p className="text-sm text-zinc-400 line-clamp-2">
                                        {board.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
