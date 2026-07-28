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
 
    // for the delete-confirmation modal
    const [boardToDelete, setBoardToDelete] = useState(null); // holds the board object, or null when closed
    const [deleting, setDeleting] = useState(false);
 
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
            navigate("/login", { replace: true });
        }
    };
 
    const openDeleteModal = (e, board) => {
        e.stopPropagation(); // stop the click from also triggering navigate() on the card
        setBoardToDelete(board);
    };
 
    const closeDeleteModal = () => {
        setBoardToDelete(null);
    };
 
    const confirmDeleteBoard = async () => {
        if (!boardToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/boards/${boardToDelete._id}`);
            setBoards((prev) => prev.filter((b) => b._id !== boardToDelete._id));
            closeDeleteModal();
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to delete board";
            setError(message);
        } finally {
            setDeleting(false);
        }
    };
 
    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Your Boards</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-white-400   bg-red-600 hover:bg-red-700 px-1 py-1 rounded"
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
                    className="mb-8 bg-zinc-800 rounded-lg p-4 flex flex-col md:flex-row gap-3"
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
                        className="shrink-0 rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium disabled:opacity-50"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <div
                                key={board._id}
                                onClick={() => navigate(`/boards/${board._id}`)}
                                className="bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h2 className="font-semibold text-lg">{board.title}</h2>
                                    <button
                                        onClick={(e) => openDeleteModal(e, board)}
                                        className="shrink-0 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
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
 
            {/* Delete confirmation modal — simple Yes/No */}
            {boardToDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-800 border border-red-800 rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-white mb-2">
                            Do you want to delete this board?
                        </h2>
                        <p className="text-sm text-zinc-400 mb-6">
                            "{boardToDelete.title}" and all of its lists and cards will be
                            permanently deleted. Are you sure you want to delete?.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-sm rounded-md text-zinc-300 hover:bg-zinc-700"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmDeleteBoard}
                                disabled={deleting}
                                className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Dashboard;
 