
import '../CSS/App.css';
import {Button} from "antd";

function App() {
  return (
    <div className="App">
      <Button onClick={() => {alert("test")}}>
        test
      </Button>
    </div>
  );
}

export default App;
