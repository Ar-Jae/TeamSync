import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, Typography, Box, Grid, Button, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const initialData = {
  columns: {
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] },
  },
  tasks: {},
  columnOrder: ['todo', 'inprogress', 'done'],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  // Delete a task
  const handleDeleteTask = async (taskId, colId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    setData(prev => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      const newColumns = { ...prev.columns };
      newColumns[colId].taskIds = newColumns[colId].taskIds.filter(id => id !== taskId);
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
    setLoading(false);
  };

  // Start editing a task
  const handleEditTask = (taskId, content) => {
    setEditingTaskId(taskId);
    setEditingValue(content);
  };

  // Save edited task
  const handleSaveEdit = async (taskId, colId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title: editingValue }),
    });
    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], content: editingValue } },
    }));
    setEditingTaskId(null);
    setEditingValue('');
    setLoading(false);
  };

  const [error, setError] = useState('');
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const tasks = await res.json();
        if (!Array.isArray(tasks)) {
          setError(tasks.error || 'Failed to fetch tasks');
          setLoading(false);
          return;
        }
        // Map tasks to columns by status
        const tasksById = {};
        const columns = {
          todo: { ...initialData.columns.todo, taskIds: [] },
          inprogress: { ...initialData.columns.inprogress, taskIds: [] },
          done: { ...initialData.columns.done, taskIds: [] },
        };
        tasks.forEach(task => {
          tasksById[task._id] = { id: task._id, content: task.title };
          const status = task.status || 'todo';
          if (columns[status]) columns[status].taskIds.push(task._id);
        });
        setData({
          ...initialData,
          tasks: tasksById,
          columns,
        });
      } catch (err) {
        setError('Failed to fetch tasks');
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }
    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
    // Update backend with new status
    const token = localStorage.getItem('token');
    await fetch(`/api/tasks/${draggableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status: finish.id }),
    });
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title: newTask, status: 'todo' }),
    });
    const task = await res.json();
    // Add new task to board
    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [task._id]: { id: task._id, content: task.title } },
      columns: {
        ...prev.columns,
        todo: {
          ...prev.columns.todo,
          taskIds: [task._id, ...prev.columns.todo.taskIds],
        },
      },
    }));
    setNewTask('');
    setLoading(false);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Add Task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleAddTask}>Add</Button>
      </Box>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container columns={12} columnSpacing={2}>
          {data.columnOrder.map((colId) => {
            const column = data.columns[colId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            // Filter out tasks with missing or invalid id
            const validTasks = tasks.filter(task => task && typeof task.id === 'string' && task.id.length > 0);
            return (
              <Grid key={column.id} sx={{ gridColumn: `span 4` }}>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>{column.title}</Typography>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 300,
                        background: snapshot.isDraggingOver ? '#e3f2fd' : '#f4f6f8',
                        borderRadius: 2,
                        p: 2,
                        transition: 'background 0.2s',
                      }}
                    >
                      {validTasks.map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 2,
                                boxShadow: snapshot.isDragging ? 6 : 1,
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <CardContent sx={{ flexGrow: 1, p: 1 }}>
                                {editingTaskId === task.id ? (
                                  <TextField
                                    value={editingValue}
                                    onChange={e => setEditingValue(e.target.value)}
                                    onBlur={() => handleSaveEdit(task.id, column.id)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleSaveEdit(task.id, column.id);
                                    }}
                                    size="small"
                                    autoFocus
                                    fullWidth
                                  />
                                ) : (
                                  <Typography
                                    onDoubleClick={() => handleEditTask(task.id, task.content)}
                                    sx={{ cursor: 'pointer' }}
                                    title="Double-click to edit"
                                  >
                                    {task.content}
                                  </Typography>
                                )}
                              </CardContent>
                              <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteTask(task.id, column.id)}
                                disabled={loading}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
