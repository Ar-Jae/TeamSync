import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Card, CardContent, Typography, Box, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './KanbanBoard.css';


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
  // Removed newTask state
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

  // format date as mm/dd/yyyy or return 'None'
  const formatDate = (d) => {
    if (!d) return 'None';
    try {
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return String(d);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    } catch (e) {
      return String(d);
    }
  };

  // open dialog and ensure we have the latest task data from the DB
  const openTaskDialog = async (task) => {
    // if this is an optimistic temp task, just show it
    if (!task || String(task.id || task._id).startsWith('temp-')) {
      setSelectedTask(task);
      setTaskOpen(true);
      return;
    }

    setTaskLoading(true);
    setTaskOpen(true);
    setSelectedTask(null);
    try {
      const id = task.id || task._id;
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tasks/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        // fallback to passed task
        setSelectedTask(task);
        return;
      }
      const t = await res.json();

  // resolve assignee if it's an id
      let assigned = t.assignedTo || null;
      if (assigned && (typeof assigned === 'string' || typeof assigned === 'number')) {
        try {
          const ures = await fetch(`/api/users/${assigned}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
          if (ures.ok) {
            assigned = await ures.json();
          }
        } catch (e) {
          // ignore and leave assigned as id
        }
      }

      // map server task shape to client shape used in UI
  const mapped = {
        id: t._id || t.id,
        content: t.title || t.content || '',
        description: t.description || '',
        assignedTo: assigned,
        completed: !!t.completed,
        dueDate: t.dueDate || '',
        priority: t.priority || 'medium',
      };

      setSelectedTask(mapped);
    } catch (e) {
      setSelectedTask(task);
    } finally {
      setTaskLoading(false);
    }
  };
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
          tasksById[task._1d] = {
            id: task._id,
            content: task.title,
            description: task.description || '',
            assignedTo: task.assignedTo || null,
            completed: !!task.completed,
            dueDate: task.dueDate || '',
            priority: task.priority || 'medium',
          };
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

  // fetch users for assignee select
  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore
      }
    }
  fetchUsers();
    return () => { cancelled = true };
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

  // Add task handler with optimistic UI; accepts either string title or a task object {title, description, assignedTo, dueDate}
  const handleAddTask = async (payload) => {
    const dataPayload = typeof payload === 'string' ? { title: payload } : (payload || {});
    const title = (dataPayload.title || '').trim();
    if (!title) return;
    setLoading(true);

    // optimistic insert with temp id
    const tempId = `temp-${Date.now()}`;
  const optimisticTask = { id: tempId, content: title, assignedTo: null, completed: false, description: dataPayload.description || '', dueDate: dataPayload.dueDate || '', priority: dataPayload.priority || 'medium' };
    // attach assignedTo details if provided as id
    if (dataPayload.assignedTo) {
      const ass = users.find(u => String(u._id || u.id) === String(dataPayload.assignedTo));
      optimisticTask.assignedTo = ass ? { _id: ass._id || ass.id, name: ass.name || `${ass.firstName || ''} ${ass.lastName || ''}`.trim(), avatar: ass.avatar } : null;
    }

    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [tempId]: optimisticTask },
      columns: {
        ...prev.columns,
        todo: {
          ...prev.columns.todo,
          taskIds: [tempId, ...prev.columns.todo.taskIds],
        },
      },
    }));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, description: dataPayload.description, assignedTo: dataPayload.assignedTo, dueDate: dataPayload.dueDate, status: 'todo' }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const task = await res.json();

      // replace temp id with real id
      setData(prev => {
        const newTasks = { ...prev.tasks };
        // remove temp entry and add real one
        delete newTasks[tempId];
  newTasks[task._id] = { id: task._id, content: task.title, assignedTo: task.assignedTo || null, completed: !!task.completed, description: task.description || '', dueDate: task.dueDate || '', priority: task.priority || 'medium' };

        const newColumns = { ...prev.columns };
        newColumns.todo = { ...newColumns.todo, taskIds: newColumns.todo.taskIds.map(id => id === tempId ? task._id : id) };

        return { ...prev, tasks: newTasks, columns: newColumns };
      });
    } catch (err) {
      // remove optimistic item on failure
      setData(prev => {
        const newTasks = { ...prev.tasks };
        delete newTasks[tempId];
        const newColumns = { ...prev.columns };
        newColumns.todo = { ...newColumns.todo, taskIds: newColumns.todo.taskIds.filter(id => id !== tempId) };
        return { ...prev, tasks: newTasks, columns: newColumns };
      });
      setError(err.message || 'Could not add task');
      // also show alert as immediate feedback
      try { window.alert(err.message || 'Could not add task') } catch(e){}
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box className="kanban-root" sx={{ flexGrow: 1, mt: 4 }}>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {/* Board header with Add task moved to top */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Board</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>Add task</Button>
        </Box>
      </Box>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Create task</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Title" fullWidth value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} sx={{ mt: 1 }} />
          <TextField label="Description" fullWidth value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} sx={{ mt: 2 }} multiline rows={3} />
          <TextField
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select labelId="assignee-label" value={form.assignedTo} label="Assignee" onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
              <MenuItem value="">Unassigned</MenuItem>
              {users.map(u => (
                <MenuItem key={u._id || u.id} value={u._id || u.id}>{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select labelId="priority-label" value={form.priority} label="Priority" onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={() => { handleAddTask(form); setForm({ title: '', description: '', assignedTo: '', dueDate: '' }); setAddOpen(false); }} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container columns={12} columnSpacing={2}>
          {data.columnOrder.map((colId) => {
            const column = data.columns[colId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            // Filter out tasks with missing or invalid id
            const validTasks = tasks.filter(task => task && typeof task.id === 'string' && task.id.length > 0);
            return (
              <Grid key={column.id} sx={{ gridColumn: `span 4` }} data-col={column.id}>
                <div className="kanban-header" style={{ marginBottom: 12 }}>
                  <div className="title">{column.title}</div>
                  <div className="kanban-count">{validTasks.length}</div>
                </div>
                {/* Add task moved to board header */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <Box
                      className={`kanban-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
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
                            <Card className={`kanban-card ${colId}`} 
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
                              <span className={`kanban-dot ${colId}`} />
          <CardContent sx={{ flexGrow: 1, p: 1 }} onClick={() => { if (editingTaskId !== task.id) { openTaskDialog(task); } }}>
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
                                  <div>
                                    <Typography
                                      onDoubleClick={() => handleEditTask(task.id, task.content)}
                                      sx={{ cursor: 'pointer' }}
                                      title="Double-click to edit"
                                    >
                                      {task.content}
                                    </Typography>
                                    <div className="kanban-badges">
                                      <div className="kanban-badge">{task.completed ? 'Done' : 'Open'}</div>
                                      {task.priority && (
                                        <div className={`kanban-badge priority-${(task.priority||'medium')}`}>Priority: {task.priority}</div>
                                      )}
                                      {/* labels removed */}
                                      {task.assignedTo && (
                                        <div className="kanban-badge">{task.assignedTo.name || task.assignedTo.firstName || 'Assigned'}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 8 }}>
                                {/* assignee avatar fallback */}
                                <div className="kanban-avatar">
                                  {task.assignedTo && task.assignedTo.avatar ? (
                                    <img src={task.assignedTo.avatar} alt={task.assignedTo.name || 'Assignee'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    (task.assignedTo && (task.assignedTo.firstName || task.assignedTo.name)) ?
                                      <span>{(task.assignedTo.firstName || task.assignedTo.name)[0]}</span> :
                                      <span>+</span>
                                  )}
                                </div>
                                <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteTask(task.id, column.id)}
                                disabled={loading}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {validTasks.length === 0 && (
                        <Typography variant="body2" align="center" sx={{ color: '#6b7280', mt: 2 }}>
                          No tasks here yet. {colId === 'todo' ? 'Add your first task above.' : 'Drag tasks here.'}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
  </Box>
  {/* Task details dialog */}
  <Dialog open={taskOpen} onClose={() => setTaskOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Task details</DialogTitle>
      <DialogContent>
        {taskLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><CircularProgress size={28} /></div>
        ) : selectedTask ? (
          <div>
            <Typography variant="h6">Title</Typography>
            <Typography sx={{ mt: 0.5 }}>{selectedTask.content || '—'}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Description</Typography>
            <Typography sx={{ mt: 0.5, color: '#6b7280' }}>{selectedTask.description || '—'}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Due date</Typography>
            <Typography sx={{ mt: 0.5 }}>{formatDate(selectedTask.dueDate)}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Assignee</Typography>
            <Typography sx={{ mt: 0.5 }}>{selectedTask.assignedTo ? (selectedTask.assignedTo.name || selectedTask.assignedTo.firstName || selectedTask.assignedTo.email) : 'Unassigned'}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Priority</Typography>
            <Typography sx={{ mt: 0.5 }}>{selectedTask.priority || 'medium'}</Typography>

            {/* Labels removed */}
          </div>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTaskOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default KanbanBoard;
