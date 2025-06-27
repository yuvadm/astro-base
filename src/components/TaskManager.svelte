<script lang="ts">
  import { onMount } from 'svelte';

  interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at?: string;
    updated_at?: string;
  }

  let tasks: Task[] = [];
  let newTask = { title: '', description: '' };
  let loading = true;
  let error: string | null = null;

  async function fetchTasks() {
    try {
      error = null;
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched tasks:', data);
      tasks = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      error = err instanceof Error ? err.message : 'Failed to fetch tasks';
      tasks = [];
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchTasks();
  });

  async function createTask(e: Event) {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      
      if (response.ok) {
        newTask = { title: '', description: '' };
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }

  async function toggleTask(task: Task) {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }

  async function deleteTask(id: number) {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }
</script>

{#if loading}
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Task Manager</h1>
    <div class="p-4 text-center">Loading tasks...</div>
  </div>
{:else if error}
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Task Manager</h1>
    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700">Error: {error}</p>
      <button 
        on:click={fetchTasks}
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  </div>
{:else}
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Task Manager</h1>
    
    <form on:submit={createTask} class="mb-8 space-y-4">
      <div>
        <input
          type="text"
          placeholder="Task title"
          bind:value={newTask.title}
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          placeholder="Task description (optional)"
          bind:value={newTask.description}
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add Task
      </button>
    </form>

    <div class="space-y-4">
      {#if tasks.length === 0}
        <p class="text-gray-500 text-center">No tasks yet. Create your first task above!</p>
      {:else}
        {#each tasks as task (task.id)}
          <div
            class="p-4 border rounded-lg {task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3
                  class="font-semibold {task.completed ? 'line-through text-gray-500' : 'text-gray-900'}"
                >
                  {task.title}
                </h3>
                {#if task.description}
                  <p
                    class="mt-1 {task.completed ? 'line-through text-gray-400' : 'text-gray-600'}"
                  >
                    {task.description}
                  </p>
                {/if}
                {#if task.created_at}
                  <p class="text-xs text-gray-400 mt-2">
                    Created: {new Date(task.created_at).toLocaleString()}
                  </p>
                {/if}
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  on:click={() => toggleTask(task)}
                  class="px-3 py-1 rounded text-sm {task.completed
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-green-500 text-white hover:bg-green-600'}"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  on:click={() => deleteTask(task.id)}
                  class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}