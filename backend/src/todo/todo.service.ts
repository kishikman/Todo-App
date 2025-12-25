import { Injectable } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  create(createTodoInput: CreateTodoInput) {
    const newTodo: Todo = {
      id: this.idCounter++,
      title: createTodoInput.title,
      isCompleted: createTodoInput.isCompleted ?? false,
      importance: createTodoInput.importance,
      urgency: createTodoInput.urgency,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll() {
    return this.todos;
  }

  findOne(id: number) {
    return this.todos.find(todo => todo.id === id);
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return null;
 
    const updatedTodo = { 
      ...this.todos[todoIndex], 
      ...updateTodoInput 
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  remove(id: number) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) return null;
    const removed = this.todos[index];
    this.todos.splice(index, 1);
    return removed;
  }
}