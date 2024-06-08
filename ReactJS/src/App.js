import "./App.css";
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import Header from '../src/components/Header';
import AddShop from '../src/components/AddShop';
import DisplayShops from '../src/components/DisplayShops';
import LeaseShop from '../src/components/LeaseShop';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      {/* Include header component */}

      {/* Define routes here*/}
      {/* Please refer the Route path and components to be mapped 
          /      ---> DisplayShops component
          /add   ---> AddShop component
          /lease ---> LeaseShop component */}
          <Header />
      
        <Routes>
          <Route path="/" element={<DisplayShops />} />
          <Route path="/add" element={<AddShop />} />
          <Route path="/lease" element={<LeaseShop />} />   
        </Routes>
      
    </div >
    </BrowserRouter >
  );
}

export default App;
