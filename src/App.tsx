import React, { useState, createElement, Fragment, useEffect } from 'react';
import './App.css';
import './prism-atom-dark.css';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { vim } from "@replit/codemirror-vim"
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { unified } from 'unified';
import remarkParse from 'remark-parse/lib';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react/lib';
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import rehypeCodeTitles from 'rehype-code-titles'
import { AiOutlineMenu } from 'react-icons/ai'

function App() {
  const [extensions, setExtensions] = useState<any>([markdown({ base: markdownLanguage, codeLanguages: languages })]); // las extensiones disponibles (markdown y vim o solo markdown)
  const lastMarkdown = window.localStorage.getItem("lastMarkdown")
  const [md, setMd] = useState<string>(lastMarkdown ? lastMarkdown : "# hello world"); // el contenido de markdown en el editor de texto
  const [reactmd, setReactMd] = useState<any>(); // el contenido de markdown convertido en componentes de react

  // funcion para declarar el preview
  const setPreview = () => {
    // utilizamos unified para convertir el texto a markdown
    unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeCodeTitles).use(rehypePrism).use(rehypeReact, { createElement, Fragment }).process(md).then(e => {
      setReactMd(e.result)
    })
  }

  // cuando el editor de texto cambie
  const handleChange = (e: any) => {
    window.localStorage.setItem("lastMarkdown", e)
    setMd(e); // declara md como lo que esta en el editor de texto
  }

  // cada vez que md cambie
  useEffect(() => {
    setPreview()
  }
    , [md]
  )


  // exportar el archivo de markdoen
  const exportToMarkdown = () => {
    // crea un elemento de html tipo <a>
    var a = document.createElement("a");
    // hace un prompt al usuario pidiendo el nombre del archivo
    let name = prompt("nombre del archivo")
    if (name === "" || name === null) {
      // si no hay nombre, anuncia un error
      alert("error: no puedes dejar el nombre del archivo vacio");
    }
    else {
      // agrega la extension de markdown
      name += ".md"
      // agrega al componente de html un url con el archivo de markdown
      a.href = window.URL.createObjectURL(new Blob([md], { type: "markdown" }));
      // si le da click al url, se va descargar el archivo
      a.download = name;
      // le da click
      a.click();
    }
  };

  const clearContent = () => {
    setMd("")
    window.localStorage.setItem("lastMarkdown", "")

  }
  // funcion de importar archivo
  const importFile = () => {
    var input = document.createElement('input'); // crea un input
    input.type = 'file'; // de tipo archivo

    input.click(); // hace click en el input para seleccionar el archivo

    input.onchange = e => {

      let target: HTMLInputElement = e.target as HTMLInputElement; // agrega el archivo a la variable target
      if (!target.files) {
        return
      }
      let file: File;
      file = target.files[0];

      let reader = new FileReader(); // lector del archivo 
      reader.readAsText(file) // lee el archivo en file
      // when it is called
      reader.onload = e => {
        if (file.name.includes(".md") || file.name.includes(".txt")) { // checa que el archivo sea .txt o .md 
          let result: string | undefined = e.target?.result?.toString(); // declara la variable result como el contenido del archivo
          result !== undefined ? setMd(result) : alert("error"); // si es que no esta vacio, declara el contenido del editor como el contenido del archivo
        }
        else {
          alert("error: el archivo necesita ser tipo markdown o txt") // si no es de tipo .md o .txt, lanza un error
        }
      }
    }

  }

  return (
    <main>
      <ReactCodeMirror value={md} onChange={e => handleChange(e)} height='100vh' width='50vw' theme={vscodeDark} extensions={extensions} />
      <div className='preview'>
        {reactmd}
      </div>

      <div className='Markdownie__div--menu'><AiOutlineMenu />			<div className='Markdownie__div--dropDown'>
        <div onClick={() => exportToMarkdown()}>Export file</div>
        <br />
        <div onClick={() => { importFile() }}>Import file</div>
        <div onClick={() => { clearContent() }}>Clear content</div>
        <div onClick={() => {
          // si ya hay otra extension que no sea markdown
          if (extensions.length > 1) {
            let e = [...extensions]
            //quita la ultima extension (vim)
            e.pop()
            setExtensions(e)
          }
          else {
            // sino, agrega la extension de vim
            let e = [...extensions]
            e.push(vim())
            setExtensions(e)
          }
        }}>Vim mode</div>
        <div onClick={() => {
          window.open("https://github.com/Adrian-007391/Markdownie")
        }}>Documentation</div>
      </div>
      </div>
    </main>


  );
}

export default App;
