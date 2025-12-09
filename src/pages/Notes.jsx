import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Check, Menu } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/items';

function DroppableContainer({ id, children, title, count, color }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all ${
        isOver ? 'ring-4 ring-purple-400 bg-purple-50' : ''
      }`}
    >
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${color}`}>
        {title}
        <span className="text-sm font-normal text-gray-500">({count})</span>
      </h3>
      {children}
    </div>
  );
}

function SortableItem({ item, onDelete, onEdit, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    if (editTitle.trim()) {
      await onEdit(item._id, editTitle);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-purple-400 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
        ) : (
          <div
            {...attributes}
            {...listeners}
            className="flex-1 cursor-move select-none"
          >
            <p className="text-gray-800">{item.title}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex gap-2 ml-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(item.title);
                }}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('movies');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = [
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'places', label: 'Places', icon: '📍' },
    { id: 'things', label: 'Things', icon: '✨' },
  ];

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: newItemTitle,
        category: activeCategory,
        status: 'todo',
      });
      setItems([response.data, ...items]);
      setNewItemTitle('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = async (id, newTitle) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, {
        title: newTitle,
      });
      setItems(items.map((item) => (item._id === id ? response.data : item)));
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, {
        status: newStatus,
      });
      setItems(items.map((item) => (item._id === id ? response.data : item)));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const activeItem = items.find((item) => item._id === active.id);

      if (
        over.id === 'done-container' &&
        activeItem &&
        activeItem.status !== 'done'
      ) {
        handleStatusChange(active.id, 'done');
      } else if (
        over.id === 'todo-container' &&
        activeItem &&
        activeItem.status !== 'todo'
      ) {
        handleStatusChange(active.id, 'todo');
      }
    }

    setActiveId(null);
  };

  const todoItems = items.filter(
    (item) => item.category === activeCategory && item.status === 'todo'
  );
  const doneItems = items.filter(
    (item) => item.category === activeCategory && item.status === 'done'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold text-purple-900">Select List</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="lg:flex">
        <div
          className={`
            w-64 min-h-screen bg-white shadow-lg p-6
            fixed top-0 left-0 z-20 transition-transform transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:min-h-full
          `}
        >
          <div className="flex justify-end lg:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              <X size={24} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Our Lists</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          {' '}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 sm:p-6">
            {' '}
            <h3 className="text-xl font-bold text-purple-900 mb-4">
              Add New {categories.find((c) => c.id === activeCategory)?.label}
            </h3>
            <form
              onSubmit={handleAddItem}
              className="flex flex-col sm:flex-row gap-3"
            >
              {' '}
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter title..."
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add</span>{' '}
              </button>
            </form>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {' '}
              <DroppableContainer
                id="todo-container"
                title="📝 To Do"
                count={todoItems.length}
                color="text-purple-900"
              >
                <div className="max-h-[50vh] lg:max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                  {' '}
                  <SortableContext
                    items={todoItems.map((item) => item._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {todoItems.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No items yet. Add one above!
                      </p>
                    ) : (
                      todoItems.map((item) => (
                        <SortableItem
                          key={item._id}
                          item={item}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </SortableContext>
                </div>
              </DroppableContainer>
              <DroppableContainer
                id="done-container"
                title="✅ Done"
                count={doneItems.length}
                color="text-green-600"
              >
                <div className="max-h-[50vh] lg:max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50">
                  {' '}
                  <SortableContext
                    items={doneItems.map((item) => item._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {doneItems.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        Nothing completed yet. Drag items here!
                      </p>
                    ) : (
                      doneItems.map((item) => (
                        <SortableItem
                          key={item._id}
                          item={item}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </SortableContext>
                </div>
              </DroppableContainer>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white rounded-lg shadow-xl p-4 border-l-4 border-purple-600">
                  <p className="text-gray-800">
                    {items.find((item) => item._id === activeId)?.title}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
