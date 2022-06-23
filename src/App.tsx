import {useState}from 'react';
import './App.css';

function App() {
    const [html , sethtml] = useState<string>(" "); 
    const [mdt , setmdt] = useState<string>("");
    
    var showdown  = require('showdown');
     let converter = new showdown.Converter();
    function addtext(ntext:string){
      setmdt(ntext);
       sethtml(converter.makeHtml(ntext));
    }
    function savetext(){
      var a = document.createElement("a");
      let name = prompt("nombre del archivo")
      if(name == "" || name == null){
        alert("error: no puedes dejar el nombre del archivo vacio");
      }
      else{

        a.href = window.URL.createObjectURL(new Blob([mdt], {type: "markdown"}));
        a.download = name+".md";
        a.click();
      }
    }
  return (
    <div className="App">
     <textarea className='App__text' onChange={e=>{addtext(e.target.value)}}/>
     <div className="App__div--markdowndisplay" dangerouslySetInnerHTML={{__html: html}}></div> 
     <button className='App__button--save' onClick={()=>{savetext()}}>save md file</button>

    </div>
  );
}

export default App;
