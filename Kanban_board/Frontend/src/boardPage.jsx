import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "./api/axios"; // your configured instance (withCredentials + baseURL already set)
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
 
 
function BoardPage() {
  const { boardId } = useParams(); // ← pulled from the URL now, no more hardcoded value
 
  const [board, setBoard] = useState(null);
  const [list, setLists] = useState([]);
  const [card, setCards] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardTitles, setNewCardTitles] = useState({});
  const [editingListId, setEditingListId] = useState(null);
  const [editListTitle, setEditListTitle] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [deletingListId, setDeletingListId] = useState("");
  const [deletingCardId, setDeletingCardId] = useState("");
 
  useEffect(() => {
    if (!boardId) return;
    axios
      .get(`/boards/${boardId}`)
      .then((response) => setBoard(response.data.data))
      .catch((err) =>
        console.log(
          "Board fetch error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  }, [boardId]);
 
  useEffect(() => {
    if (!boardId) return;
    axios
      .get(`/lists/board/${boardId}`)
      .then((response) => setLists(response.data.data))
      .catch((err) =>
        console.log(
          "List fetch error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  }, [boardId]);
 
  useEffect(() => {
    if (list.length === 0) return;
    const fetchAllCards = async () => {
      try {
        const requests = list.map((ls) =>
          axios.get(`/cards/list/${ls._id}`)
        );
        const responses = await Promise.all(requests);
        const allCards = responses.flatMap((res) => res.data.data);
        allCards.sort((a, b) => a.position - b.position);
        setCards(allCards);
      } catch (err) {
        console.log(
          "Card fetch error:",
          err.response?.status,
          err.response?.data || err.message
        );
      }
    };
    fetchAllCards();
  }, [list]);
 
  const handleCreateList = () => {
    if (!newListTitle) return;
    axios
      .post("/lists/", {
        title: newListTitle,
        position: list.length,
        board: boardId,
      })
      .then((response) => {
        setLists((prevLists) => [...prevLists, response.data.data]);
        setNewListTitle("");
      })
      .catch((err) =>
        console.log(
          "Create list error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  };
 
  const handleCreateCard = (listId) => {
    const title = newCardTitles[listId];
    if (!title) return;
    axios
      .post("/cards/", {
        title,
        position: card.filter((c) => c.list === listId).length,
        list: listId,
      })
      .then((response) => {
        setCards((prevCards) => [...prevCards, response.data.data]);
        setNewCardTitles((prev) => ({ ...prev, [listId]: "" }));
      })
      .catch((err) =>
        console.log(
          "Create card error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  };
 
  const handleEditList = (id) => {
    if (!editListTitle) return;
    axios
      .patch(`/lists/${id}`, {
        title: editListTitle,
      })
      .then((response) => {
        setLists((prevLists) =>
          prevLists.map((ls) => (ls._id === id ? response.data.data : ls))
        );
        setEditingListId(null);
        setEditListTitle("");
      })
      .catch((err) =>
        console.log(
          "Edit list error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  };
 
  const handleEditCard = (id) => {
    if (!editCardTitle) return;
    axios
      .patch(`/cards/${id}`, {
        title: editCardTitle,
      })
      .then((response) => {
        setCards((prevCards) =>
          prevCards.map((c) => (c._id === id ? response.data.data : c))
        );
        setEditingCardId(null);
        setEditCardTitle("");
      })
      .catch((err) =>
        console.log(
          "Edit card error:",
          err.response?.status,
          err.response?.data || err.message
        )
      );
  };
 
  const handleDeleteList = (id) => {
    axios
      .delete(`/lists/${id}`)
      .then(() => {
        setLists((prevLists) => prevLists.filter((ls) => ls._id !== id));
      })
      .catch((err) => {
        console.log(
          "Delete list error:",
          err.response?.status,
          err.response?.data || err.message
        );
      });
  };
 
  const handleDeleteCard = (id) => {
    axios
      .delete(`/cards/${id}`)
      .then(() => {
        setCards((prevCards) => prevCards.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.log(
          "Deleting Card Error:",
          err.response?.status,
          err.response?.data || err.message
        );
      });
  };
 
  const handleDragEnd = (results) => {
    console.log(results);
 
    const { source, destination, type } = results;
 
    if (!destination) return;
 
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
 
    if (type === 'list') {
      const reorderedLists = Array.from(list);
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
 
      setLists(reorderedLists);
 
      reorderedLists.forEach((ls, index) => {
        axios.patch(`/lists/${ls._id}`, {
            newPosition: index,
        }).catch((err) =>
            console.log("Reorder list error:", err.response?.status, err.response?.data || err.message)
        );
      });
      return;
    }
 
    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
 
    if (sourceListId === destListId) {
      const listCards = card.filter((c) => c.list === sourceListId);
      const otherCards = card.filter((c) => c.list !== sourceListId);
 
      const reorderedListCards = Array.from(listCards);
      const [movedCard] = reorderedListCards.splice(source.index, 1);
      reorderedListCards.splice(destination.index, 0, movedCard);
 
      const updatedListCards = reorderedListCards.map((c, index) => ({
        ...c,
        position: index,
      }));
 
      setCards([...otherCards, ...updatedListCards]);
 
      updatedListCards.forEach((c) => {
        axios.patch(`/cards/${c._id}`, {
            position: c.position,
        })
        .catch((err) =>
            console.log("Move card error:", err.response?.status, err.response?.data || err.message)
        );
      });
    } else {
      const sourceCards = card.filter((c) => c.list === sourceListId);
      const destCards = card.filter((c) => c.list === destListId);
      const otherCards = card.filter(
        (c) => c.list !== sourceListId && c.list !== destListId
      );
 
      const [movedCard] = sourceCards.splice(source.index, 1);
      movedCard.list = destListId;
      destCards.splice(destination.index, 0, movedCard);
 
      const updatedSourceCards = sourceCards.map((c, index) => ({ ...c, position: index }));
      const updatedDestCards = destCards.map((c, index) => ({ ...c, position: index }));
 
      setCards([...otherCards, ...updatedSourceCards, ...updatedDestCards]);
 
      [...updatedSourceCards, ...updatedDestCards].forEach((c) => {
          axios.patch(`/cards/${c._id}`, {
              list: c.list,
              position: c.position,
          }).catch((err) =>
              console.log("Move card error:", err.response?.status, err.response?.data || err.message)
          );
      });
    }
  };
 
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full min-h-screen bg-zinc-900 text-white p-4 sm:p-6 lg:p-8">
        <Link
          to="/dashboard"
          className="inline-block mb-4 text-sm text-zinc-400 hover:text-white"
        >
          ← Back to boards
        </Link>
        <h1 className="text-2xl font-bold mb-6">{board ? board.title : "Loading..."}</h1>
 
        <Droppable droppableId="board" direction="horizontal" type="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 items-start overflow-x-auto pb-4"
            >
              {list.map((ls, index) => (
                <Draggable key={ls._id} draggableId={ls._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-zinc-800 rounded-lg p-3 w-56 sm:w-64 shrink-0 flex flex-col max-h-[80vh]"
                    >
                      {ls._id === editingListId ? (
                        <div className="mb-3 shrink-0">
                          <input
                            type="text"
                            value={editListTitle}
                            onChange={(e) => setEditListTitle(e.target.value)}
                            className="w-full p-1 rounded text-black text-sm mb-1"
                          />
                          <button onClick={() => handleEditList(ls._id)} className="bg-blue-500 text-xs px-2 py-1 rounded">
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center mb-3 shrink-0"
                        >
                          <h3
                            className="font-semibold cursor-pointer"
                            onClick={() => {
                              setEditingListId(ls._id);
                              setEditListTitle(ls.title);
                            }}
                          >
                            {ls.title}
                          </h3>
                          <button
                            onClick={() => handleDeleteList(ls._id)}
                            className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
 
                      <Droppable droppableId={ls._id} type="card">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex-1 overflow-y-auto space-y-2 mb-2"
                          >
                            {card
                              .filter((c) => c.list === ls._id)
                              .map((c, index) => (
                                <Draggable key={c._id} draggableId={c._id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-zinc-700 rounded p-2 text-sm break-words"
                                    >
                                      {c._id === editingCardId ? (
                                        <>
                                          <input
                                            type="text"
                                            value={editCardTitle}
                                            onChange={(e) => setEditCardTitle(e.target.value)}
                                            className="w-full p-1 rounded text-black text-sm mb-1"
                                          />
                                          <button
                                            onClick={() => handleEditCard(c._id)}
                                            className="bg-blue-500 text-xs px-2 py-1 rounded"
                                          >
                                            Save
                                          </button>
                                        </>
                                      ) : (
                                        <div className="flex justify-between items-center">
                                          <span
                                            className="cursor-pointer"
                                            onClick={() => {
                                              setEditingCardId(c._id);
                                              setEditCardTitle(c.title);
                                            }}
                                          >
                                            {c.title}
                                          </span>
                                          <button
                                            onClick={() => handleDeleteCard(c._id)}
                                            className="bg-red-500 hover:bg-red-600 text-xs px-1 py-1 rounded"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
 
                      <div className="shrink-0">
                        <input
                          type="text"
                          value={newCardTitles[ls._id] || ""}
                          onChange={(e) => setNewCardTitles((prev) => ({ ...prev, [ls._id]: e.target.value }))}
                          placeholder="New card title"
                          className="w-full p-2 rounded bg-zinc-700 text-white text-sm mb-2"
                        />
                        <button
                          onClick={() => handleCreateCard(ls._id)}
                          className="bg-green-600 px-3 py-1 rounded text-sm w-full"
                        >
                          Add card
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
 
              <div className="bg-zinc-800 rounded-lg p-3 w-56 sm:w-64 shrink-0">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="New list title"
                  className="w-full p-2 rounded bg-zinc-700 text-white mb-2"
                />
                <button onClick={handleCreateList} className="bg-green-600 px-3 py-1 rounded w-full">
                  Add list
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
 
 
export { BoardPage };
  