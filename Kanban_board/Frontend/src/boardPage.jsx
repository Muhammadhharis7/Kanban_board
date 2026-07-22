// import { useState, useEffect } from "react";
// import axios from "axios";

// function BoardPage() {
//   const boardId = "6a5bd714f1307db0847cb8a7";
//   const [board, setBoards] = useState(null);
//   const [list, setLists] = useState([]);
//   const [card, setCards] = useState([]);
//   const [newListTitle, setNewListTitle] = useState("");
//   const [newCardTitle, setNewCardTitle] = useState("");

//   useEffect(() => {
//     // Fetch the board itself
//     axios
//       .get(`http://localhost:8000/api/v1/boards/${boardId}`)
//       .then((response) => {
//         setBoards(response.data.data);
//       }).catch((err) => {
//         console.log(`List error : ${err.response?.status}- ${JSON.stringify(err.response?.data) || err.message}`);
//       });
//   }, []);

//   // Fetch the lists for this board
//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/v1/lists/board/${boardId}`)
//       .then((response) => {
//         setLists(response.data.data);
//       }).catch((err) => {
//         console.log(`List error : ${err.response?.status,err.response?.data || err.message}`);
//       });
//   }, []);

//   // Once we have lists fetch all cards for each lists
//   useEffect(() => {
//     if (list.length === 0) return;

//     const fetcAllCards = async () => {
//       try {
//         const allCardsPromises = list.map((ls) => {
//           axios.get(`http://localhost:8000/api/v1/cards/list/${ls._id}`)
  
//         })
//           const responses = await Promise.all(allCardsPromises)
//           console.log("Responses:", responses);
//           const allCards = responses.flatMap((res) => res.data.data)
  
//           setCards(allCards) // Replace don't append
//         }
//       catch (error) {
//         console.log("Error fetching cards:", err.response?.status, err.response?.data || err.message);
//       }
//       fetcAllCards();
//     }}, [list]); // runs again whenever lists changes

//     // list.forEach((ls) => {
//     //   // axios
//     //   //   .get(`http://localhost:8000/api/v1/cards/list/${ls._id}`)
//     //   //   .then((response) => {
//     //   //     console.log(`CARDS for list ${ls._id}:`, response.data);
//     //   //     setCards((prevCards) => [...prevCards, ...response.data.data]);
//     //   //   }).catch((err) => {
//     //   //     console.log(`Card fetch error for ${ls._id}:`, err.response?.status, err.response?.data || err.message);
//     //   //   });
//     // });

//   // Creating new list
//   const handleCreateList = () => {
//     if (!newListTitle) return;

//     axios
//       .post("http://localhost:8000/api/v1/lists/", {
//         title: newListTitle,
//         position: list.length,
//         board: boardId,
//       })
//       .then((response) => {
//         setLists((prevLists) => [...prevLists, response.data.data]);
//         setNewListTitle("");
//       }).catch((err) => {
//         console.log(`The error in creating list is ${err.message}`);
//       });
//   };

//   // Creating a card
//   const handleCreateCard = (listId) => {
//     if (!newCardTitle) return;

//     axios
//       .post("http://localhost:8000/api/v1/cards/", {
//         title: newCardTitle,
//         position: card.filter((c) => c.list === listId).length,
//         list: listId,
//       })
//       .then((response) => {
//         setCards((prevCards) => [...prevCards, response.data.data]);
//         setNewCardTitle("");
//       }).catch((err) => {
//         console.log(`The error in creating card is ${err.message}`);
//       });
//   };

//   return (
//     <div className="bg-board-purple h-dvh w-full">
//       <div className="bg-board-purple w-full h-20 text-2xl leading-18 pl-6 font-bold">
//         {board ? board.title :"Loading..."}
//       </div>
//       <div className="bg-blue-500 m-10  h-100 w-80">
//         {list.map((ls) => {
//           return <div key={ls._id} className="text-xl p-5 text-white font-bold">
//             {ls.title}

//             {card.filter((c)=> c.list?._id === ls._id|| c.list === ls._id).map((c)=>{
//               return <div key={c._id}>{c.title}</div>
//             })}

//             <input type="text" placeholder="New card title" value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value) }className="text-sm p-1 text-black m-2 border-none w-[95%] bg-white rounded mt-4" />
//             <button onClick={() => handleCreateCard(ls._id)} className="bg-green-500 px-2 py-1 text-sm rounded m-2 h-15"  >Add Card</button>
//             </div>
//         })}
//       </div>
//     </div>
//   );
// }

// export { BoardPage };


// import { useState, useEffect } from "react";
// import axios from "axios";

// function BoardPage() {
//   const boardId = "6a5bd714f1307db0847cb8a7";

//   const [board, setBoard] = useState(null);
//   const [list, setLists] = useState([]);
//   const [card, setCards] = useState([]);
//   const [newListTitle, setNewListTitle] = useState("");
//   const [newCardTitle, setNewCardTitle] = useState({});

//   // Fetch the board
//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/v1/boards/${boardId}`)
//       .then((response) => setBoard(response.data.data))
//       .catch((err) =>
//         console.log("Board fetch error:", err.response?.status, err.response?.data || err.message)
//       );
//   }, []);

//   // Fetch all lists for the board
//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/v1/lists/board/${boardId}`)
//       .then((response) => setLists(response.data.data))
//       .catch((err) =>
//         console.log("List fetch error:", err.response?.status, err.response?.data || err.message)
//       );
//   }, []);

//   // Once lists are loaded, fetch all cards across all lists
//   useEffect(() => {
//     if (list.length === 0) return;

//     const fetchAllCards = async () => {
//       try {
//         const requests = list.map((ls) =>
//           axios.get(`http://localhost:8000/api/v1/cards/list/${ls._id}`)
//         );
//         const responses = await Promise.all(requests);
//         const allCards = responses.flatMap((res) => res.data.data);
//         setCards(allCards);
//       } catch (err) {
//         console.log("Card fetch error:", err.response?.status, err.response?.data || err.message);
//       }
//     };

//     fetchAllCards();
//   }, [list]);

//   // Create a new list
//   const handleCreateList = () => {
//     if (!newListTitle) return;

//     axios
//       .post("http://localhost:8000/api/v1/lists/", {
//         title: newListTitle,
//         position: list.length,
//         board: boardId,
//       })
//       .then((response) => {
//         setLists((prevLists) => [...prevLists, response.data.data]);
//         setNewListTitle("");
//       })
//       .catch((err) =>
//         console.log("Create list error:", err.response?.status, err.response?.data || err.message)
//       );
//   };

//   // Create a new card inside a specific list
//   const handleCreateCard = (listId) => {
//     const title = newCardTitle[listId]
//     if (!newCardTitle) return;

//     axios
//       .post("http://localhost:8000/api/v1/cards/", {
//         title: newCardTitle,
//         position: card.filter((c) => c.list === listId).length,
//         list: listId,
//       })
//       .then((response) => {
//         setCards((prevCards) => [...prevCards, response.data.data]);
//         setNewCardTitle((prev) => ({...prev,[listId]:""}));
//       })
//       .catch((err) =>
//         console.log("Create card error:", err.response?.status, err.response?.data || err.message)
//       );
//   };

//   return (
//     <div className="w-full min-h-screen bg-zinc-900 text-white p-8">
//       <h1 className="text-2xl font-bold mb-6">
//         {board ? board.title : "Loading..."}
//       </h1>

//       <div className="flex gap-4">
//         {list.map((ls) => (
//           <div key={ls._id} className="bg-zinc-800 rounded-lg p-3 w-64">
//             <h3 className="font-semibold mb-3">{ls.title}</h3>

//             {card
//               .filter((c) => c.list === ls._id)
//               .map((c) => (
//                 <div key={c._id} className="bg-zinc-700 rounded p-2 mb-2 text-sm">
//                   {c.title}
//                 </div>
//               ))}

//             <input
//               type="text"
//               value={newCardTitle[ls._id] || ""}
//               onChange={(e) => setNewCardTitle((prev) => ({...prev,[ls._id]:e.target.value}))}
//               placeholder="New card title"
//               className="w-full p-2 rounded bg-zinc-700 text-white mt-2 text-sm"
//             />
//             <button
//               onClick={() => handleCreateCard(ls._id)}
//               className="bg-green-600 px-3 py-1 rounded mt-2 text-sm mt-2"
//             >
//               Add card
//             </button>
//           </div>
//         ))}

//         <div className="bg-zinc-800 rounded-lg p-3 w-64">
//           <input
//             type="text"
//             value={newListTitle}
//             onChange={(e) => setNewListTitle(e.target.value)}
//             placeholder="New list title"
//             className="w-full p-2 rounded bg-zinc-700 text-white mb-2"
//           />
//           <button
//             onClick={() => handleCreateCard(ls._id)}
//             className="bg-green-600 px-3 py-1 rounded"
//           >
//             Add list
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { BoardPage };


// import { useState, useEffect } from "react";
// import axios from "axios";

// function BoardPage() {
//   const boardId = "6a5bd714f1307db0847cb8a7";

//   const [board, setBoard] = useState(null);
//   const [list, setLists] = useState([]);
//   const [card, setCards] = useState([]);
//   const [newListTitle, setNewListTitle] = useState("");
//   const [newCardTitles, setNewCardTitles] = useState({});
//   // Track which item is curently in edit mode
//   const [editingListId,setEditingListId] = useState("")
//   // Track the actual text being typed while editing
//   const [editListTitle,setEditListTitle] = useState("")

//   const [editingCardId,setEditingCardId] = useState("")

//   const [editCardTitle,setEditCardTitle] = useState("")

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/v1/boards/${boardId}`)
//       .then((response) => setBoard(response.data.data))
//       .catch((err) =>
//         console.log("Board fetch error:", err.response?.status, err.response?.data || err.message)
//       );
//   }, []);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/api/v1/lists/board/${boardId}`)
//       .then((response) => setLists(response.data.data))
//       .catch((err) =>
//         console.log("List fetch error:", err.response?.status, err.response?.data || err.message)
//       );
//   }, []);

//   useEffect(() => {
//     if (list.length === 0) return;

//     const fetchAllCards = async () => {
//       try {
//         const requests = list.map((ls) =>
//           axios.get(`http://localhost:8000/api/v1/cards/list/${ls._id}`)
//         );
//         const responses = await Promise.all(requests);
//         const allCards = responses.flatMap((res) => res.data.data);
//         setCards(allCards);
//       } catch (err) {
//         console.log("Card fetch error:", err.response?.status, err.response?.data || err.message);
//       }
//     };

//     fetchAllCards();
//   }, [list]);
// // handling creating list
//   const handleCreateList = () => {
//     if (!newListTitle) return;

//     axios
//       .post("http://localhost:8000/api/v1/lists/", {
//         title: newListTitle,
//         position: list.length,
//         board: boardId,
//       })
//       .then((response) => {
//         setLists((prevLists) => [...prevLists, response.data.data]);
//         setNewListTitle("");
//       })
//       .catch((err) =>
//         console.log("Create list error:", err.response?.status, err.response?.data || err.message)
//       );
//   };
// // handling creating card
//   const handleCreateCard = (listId) => {
//     const title = newCardTitles[listId];
//     if (!title) return;

//     axios
//       .post("http://localhost:8000/api/v1/cards/", {
//         title,
//         position: card.filter((c) => c.list === listId).length,
//         list: listId,
//       })
//       .then((response) => {
//         setCards((prevCards) => [...prevCards, response.data.data]);
//         setNewCardTitles((prev) => ({ ...prev, [listId]: "" }));
//       })
//       .catch((err) =>
//         console.log("Create card error:", err.response?.status, err.response?.data || err.message)
//       );
//   };

// // handling edit list
//   const handleEditList = (editingListId) => {
//     if(!editListTitle) return


//     axios.patch(`http://localhost:8000/api/v1/lists/${editingListId}`,{
//       title:editListTitle
//     }).then((response) => {
//       setLists((prevLists) => prevLists.map((ls) => ls._id === editingListId ? response.data.data : ls))
//       setEditingListId(null)
//       setEditListTitle("")
//     }).catch((err) => console.log(`Edit list error : ${err.response?.status, err.response?.data || err.message}`))
//   }


// // handling edit card
//   const handleEditCard = (editingCardId) => {
//     if(!editCardTitle)return

//     axios.patch(`http://localhost:8000/api/v1/cards/${editingCardId}`,{
//       title: editCardTitle
//     }).then((response) =>{ setCards((prevCards)=> prevCards.map((c) => c._id === editingCardId ? response.data.data : c))
//       setEditingCardId(null)
//       setEditCardTitle("")
//     }).catch((err) => console.log(err.response?.status,err.response?.data || err.message))
//   }

//   return (
//     // Parent element
//     <div className="w-full min-h-screen bg-zinc-900 text-white p-8">
//       {/* Board title */}
//       <h1 className="text-2xl font-bold mb-6">
//         {board ? board.title : "Loading..."}
//       </h1>
//       {/* Render List and card */}
//       <div className="flex gap-4 items-start">
//         {list.map((ls) => (
//           <><div className="bg--zinc-700 rounded p-2 text-sm">
//             {ls._id === editingListId ? (
//               <><input type="text" name="" id="" placeholder="Edit the list title" onChange={(e) => setEditListTitle(e.target.value)} value={editListTitle} />
//                 <button onClick={() => handleEditList(ls._id)} className="">Save</button></>
//             ) : (
//               <span onClick={() => {
//                 setEditingListId(ls._id); setEditListTitle(ls.title);
//               } }>{ls.title}</span>
//             )}
//           </div><div
//             key={ls._id}
//             className="bg-zinc-800 rounded-lg p-3 w-64 flex flex-col max-h-[80vh]"
//           >
//               <h3 className="font-semibold mb-3 shrink-0">{ls.title}</h3>

//               <div className="flex-1 overflow-y-auto space-y-2 mb-2">
//                 {card
//                   .filter((c) => c.list === ls._id)
//                   .map((c) => (
//                     <><div className="bg-zinc-700 rounded p-2 text-sm">
//                       {c._id === editingCardId ? (
//                         <>
//                           <input type="text" placeholder="Edit the card" onChange={(e) => setEditCardTitle(e.target.value)} value={editCardTitle} className="w-full p-1 rounded text-black text-sm mb-1" />
//                           <button onClick={handleEditCard(c._id)} className="bg-blue-500 text-xs px-2 py-1 rounded ">Save</button>
//                         </>
//                       ) : (
//                         <span onClick={() => {
//                           setEditingCardId(c._id);
//                           setEditCardTitle(c.title);
//                         } }></span>
//                       )}
//                     </div><div
//                       key={c._id}
//                       className="bg-zinc-700 rounded p-2 text-sm break-words"
//                     >
//                         {c.title}
//                       </div></>
//                   ))}
//               </div>
//               {/* Add new cards */}
//               <div className="shrink-0">
//                 <input
//                   type="text"
//                   value={newCardTitles[ls._id] || ""}
//                   onChange={(e) => setNewCardTitles((prev) => ({ ...prev, [ls._id]: e.target.value }))}
//                   placeholder="New card title"
//                   className="w-full p-2 rounded bg-zinc-700 text-white text-sm mb-2" />
//                 <button
//                   onClick={() => handleCreateCard(ls._id)}
//                   className="bg-green-600 px-3 py-1 rounded text-sm w-full"
//                 >
//                   Add card
//                 </button>
//               </div>

//               {/* Edit card */}
//             </div></>
//         ))}
//         {/* Add new List */}
//         <div className="bg-zinc-800 rounded-lg p-3 w-64 shrink-0">
//           <input
//             type="text"
//             value={newListTitle}
//             onChange={(e) => setNewListTitle(e.target.value)}
//             placeholder="New list title"
//             className="w-full p-2 rounded bg-zinc-700 text-white mb-2"
//           />
//           <button
//             onClick={handleCreateList}
//             className="bg-green-600 px-3 py-1 rounded w-full"
//           >
//             Add list
//           </button>
//         </div>
//         {/* Edit list */}
//       </div>
//     </div>
//   );
// }

// export { BoardPage };


import { useState, useEffect } from "react";
import axios from "axios";

function BoardPage() {
  const boardId = "6a5bd714f1307db0847cb8a7";

  const [board, setBoard] = useState(null);
  const [list, setLists] = useState([]);
  const [card, setCards] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardTitles, setNewCardTitles] = useState({});
  const [editingListId, setEditingListId] = useState(null);
  const [editListTitle, setEditListTitle] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editCardTitle, setEditCardTitle] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/boards/${boardId}`)
      .then((response) => setBoard(response.data.data))
      .catch((err) => console.log("Board fetch error:", err.response?.status, err.response?.data || err.message));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/lists/board/${boardId}`)
      .then((response) => setLists(response.data.data))
      .catch((err) => console.log("List fetch error:", err.response?.status, err.response?.data || err.message));
  }, []);

  useEffect(() => {
    if (list.length === 0) return;
    const fetchAllCards = async () => {
      try {
        const requests = list.map((ls) => axios.get(`http://localhost:8000/api/v1/cards/list/${ls._id}`));
        const responses = await Promise.all(requests);
        setCards(responses.flatMap((res) => res.data.data));
      } catch (err) {
        console.log("Card fetch error:", err.response?.status, err.response?.data || err.message);
      }
    };
    fetchAllCards();
  }, [list]);

  const handleCreateList = () => {
    if (!newListTitle) return;
    axios
      .post("http://localhost:8000/api/v1/lists/", { title: newListTitle, position: list.length, board: boardId })
      .then((response) => {
        setLists((prevLists) => [...prevLists, response.data.data]);
        setNewListTitle("");
      })
      .catch((err) => console.log("Create list error:", err.response?.status, err.response?.data || err.message));
  };

  const handleCreateCard = (listId) => {
    const title = newCardTitles[listId];
    if (!title) return;
    axios
      .post("http://localhost:8000/api/v1/cards/", {
        title,
        position: card.filter((c) => c.list === listId).length,
        list: listId,
      })
      .then((response) => {
        setCards((prevCards) => [...prevCards, response.data.data]);
        setNewCardTitles((prev) => ({ ...prev, [listId]: "" }));
      })
      .catch((err) => console.log("Create card error:", err.response?.status, err.response?.data || err.message));
  };

  const handleEditList = (id) => {
    if (!editListTitle) return;
    axios
      .patch(`http://localhost:8000/api/v1/lists/${id}`, { title: editListTitle })
      .then((response) => {
        setLists((prevLists) => prevLists.map((ls) => (ls._id === id ? response.data.data : ls)));
        setEditingListId(null);
        setEditListTitle("");
      })
      .catch((err) => console.log("Edit list error:", err.response?.status, err.response?.data || err.message));
  };

  const handleEditCard = (id) => {
    if (!editCardTitle) return;
    axios
      .patch(`http://localhost:8000/api/v1/cards/${id}`, { title: editCardTitle })
      .then((response) => {
        setCards((prevCards) => prevCards.map((c) => (c._id === id ? response.data.data : c)));
        setEditingCardId(null);
        setEditCardTitle("");
      })
      .catch((err) => console.log("Edit card error:", err.response?.status, err.response?.data || err.message));
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">{board ? board.title : "Loading..."}</h1>

      <div className="flex gap-4 items-start">
        {list.map((ls) => (
          <div key={ls._id} className="bg-zinc-800 rounded-lg p-3 w-64 flex flex-col max-h-[80vh]">
            {/* List title — edit mode built directly in, no duplicate div */}
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
              <h3
                className="font-semibold mb-3 shrink-0 cursor-pointer"
                onClick={() => {
                  setEditingListId(ls._id);
                  setEditListTitle(ls.title);
                }}
              >
                {ls.title}
              </h3>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 mb-2">
              {card
                .filter((c) => c.list === ls._id)
                .map((c) => (
                  <div key={c._id} className="bg-zinc-700 rounded p-2 text-sm break-words">
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
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          setEditingCardId(c._id);
                          setEditCardTitle(c.title);
                        }}
                      >
                        {c.title}
                      </span>
                    )}
                  </div>
                ))}
            </div>

            <div className="shrink-0">
              <input
                type="text"
                value={newCardTitles[ls._id] || ""}
                onChange={(e) => setNewCardTitles((prev) => ({ ...prev, [ls._id]: e.target.value }))}
                placeholder="New card title"
                className="w-full p-2 rounded bg-zinc-700 text-white text-sm mb-2"
              />
              <button onClick={() => handleCreateCard(ls._id)} className="bg-green-600 px-3 py-1 rounded text-sm w-full">
                Add card
              </button>
            </div>
          </div>
        ))}

        <div className="bg-zinc-800 rounded-lg p-3 w-64 shrink-0">
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
    </div>
  );
}

export { BoardPage };