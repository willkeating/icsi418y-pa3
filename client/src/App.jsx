
import Signup from './components/Signup';
import Login from './components/Login';//grab code from signup and login


function App(){
  return (//render the signup and login components
      <div>
        <Signup />
        <Login />
      </div>
  );
}

export default App;