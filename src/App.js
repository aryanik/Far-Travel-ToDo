import { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  const onUpdateItemsById = (item) => {
    setIsUpdating(true);
    setSelectedItem(item);
  };

  function handleUpdateItem(updatedItem) {
    setItems((items) =>
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setIsUpdating(false);
    setSelectedItem(null);
    
  }

  console.log(items);
  function handleClearItems() {
    setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form
        onAddItems={handleAddItems}
        selectedItem={selectedItem}
        setIsUpdating={setIsUpdating}
        isUpdating={isUpdating}
        onUpdateItem={handleUpdateItem}
      />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItems}
        onToggleItems={handleToggleItem}
        onClearItems={handleClearItems}
        onUpdateItemList={onUpdateItemsById}
        // onUpdateItemList={handleUpdateItem}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1> 🏝️ Far Travel</h1>;
}

function Form({
  onAddItems,
  selectedItem,
  isUpdating,
  setIsUpdating,
  onUpdateItem,
}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedItem) {
      setDescription(selectedItem.description);
      setQuantity(selectedItem.quantity);
    }
  }, [selectedItem]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    if (isUpdating) {
      onUpdateItem({
        ...selectedItem,
        description,
        quantity,
      });
    } else {
      const newItem = { description, quantity, packed: false, id: Date.now() };
      onAddItems(newItem);
    }

    setDescription("");
    setQuantity(1);
    setIsUpdating(false);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your Trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {/* there we can also add + before e.target */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="add-items"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>{isUpdating ? "Update" : "Add"}</button>
    </form>
  );
}

function PackingList({
  items,
  onDeleteItem,
  onToggleItems,
  onClearItems,
  onUpdateItemList
}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <></>
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItems={onToggleItems}
            onClearItems={onClearItems}
            // onUpdateItems={onUpdateItems}
            onUpdateItemList={onUpdateItemList}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort By input Order</option>
          <option value="description">Sort By description</option>
          <option value="packed">Sort By packed status</option>
        </select>
        <button onClick={onClearItems}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItems, onUpdateItemList }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={(id) => onToggleItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={(id) => onDeleteItem(item.id)}>❌</button>
      <button onClick={() => onUpdateItemList(item)}  style={{color: "white", border: "solid 1px"}}>Update Item</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em> Start Adding some items on your packing list 🚀🎧 </em>
      </p>
    );
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got Everything ! Ready to go  ✈️"
          : `You have {numItems} items on your list, and you have already packed
        ${numPacked} ,(${percentage} %)`}
      </em>
    </footer>
  );
}
