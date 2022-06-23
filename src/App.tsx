import {useState}from 'react';
import './App.css';
import { getValue } from '@testing-library/user-event/dist/utils';

function App() {
    const [html , sethtml] = useState<string>(" "); 
    var showdown  = require('showdown');
     let converter = new showdown.Converter();
    function addtext(ntext:string){
       sethtml(converter.makeHtml(ntext));
    }
  return (
    <div className="App">
     <textarea className='App__text' onChange={e=>{addtext(e.target.value)}}/>
     <div className="App__div--markdowndisplay" dangerouslySetInnerHTML={{__html: html}}></div> 
    </div>
  );
}

export default App;
