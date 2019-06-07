import React, { Component } from "react";
import { generateRandomId } from "./utils";
import tasks from "./tasks.json";
import { getTasks } from "./task-svc";

const apiDummyGet = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ tasks });
    }, 3000);
  });

class Loading extends Component {
  render() {
    return (
      <tr>
        <td colspan="2">Loading Tasks...</td>
      </tr>
    );
  }
}

class TodoListItem extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.task.taskName}</td>
        <td>
          <input type="checkbox" defaultChecked={this.props.task.finished} />
        </td>
      </tr>
    );
  }
}

function NewTaskForm({ addTask }) {
  const onSubmit = evt => {
    evt.preventDefault();
    const eventNameInput = evt.target.elements.eventName;
    addTask(eventNameInput.value);
    eventNameInput.value = "";
  };
  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="eventName" placeholder="Write Task Name" />
      <button type="submit">Add</button>
    </form>
  );
}

export default class TodoList extends Component {
  constructor(props) {
    super();
    this.state = { tasks, loading: true };
    this.addTask = this.addTask.bind(this);
  }

  addTask(name) {
    const oldTaskNames = this.state.tasks;
    const newTask = {
      taskName: name,
      finished: false,
      id: generateRandomId()
    };
    const newTaskNames = [...oldTaskNames, newTask];
    this.setState({ tasks: newTaskNames });
  }

  componentDidMount() {
    apiDummyGet().then(data => {
      this.setState({
        loading: false,
        data
      });
    });
  }

  render() {
    const taskItems = this.state.tasks.map(task => (
      <TodoListItem key={task.id} task={task} />
    ));

    if (this.state.loading) {
      return (
        <div className="container">
          <h1>
            Get It Done! <br />
            <small>For the truly industrious</small>
          </h1>

          <table>
            <thead>
              <tr>
                <td>Task</td>
                <td>Done?</td>
              </tr>
            </thead>
            <tbody>
              <Loading />
            </tbody>
          </table>

          <hr />
          <NewTaskForm addTask={this.addTask} />
        </div>
      );
    }

    return (
      <div className="container">
        <h1>
          Get It Done! <br />
          <small>For the truly industrious</small>
        </h1>

        <table>
          <thead>
            <tr>
              <td>Task</td>
              <td>Done?</td>
            </tr>
          </thead>
          <tbody>{taskItems}</tbody>
        </table>

        <hr />
        <NewTaskForm addTask={this.addTask} />
      </div>
    );
  }
}
