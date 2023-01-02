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
    const [extensions, setExtensions] = useState<any>([markdown({ base: markdownLanguage, codeLanguages: languages })]);
    const [md, setMd] = useState<string>("# hello world");
    const [reactmd, setReactMd] = useState<any>();

    const handleChange = (e: any) => {
        setMd(e);
    }

    useEffect(() => {
        unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeCodeTitles).use(rehypePrism).use(rehypeReact, { createElement, Fragment }).process(md).then(e => {
            setReactMd(e.result)
        })
    }
        , [md]
    )

    const exportToMarkdown = () => {
        var a = document.createElement("a");
        let name = prompt("nombre del archivo")
        if (name === "" || name === null) {
            alert("error: no puedes dejar el nombre del archivo vacio");
        }
        else {
            a.href = window.URL.createObjectURL(new Blob([md], { type: "markdown" }));
            a.download = name + ".md";
            a.click();
        }
    };

    // import file function
    const importFile = () => {
        var input = document.createElement('input'); // input that selects the file
        input.type = 'file';

        input.click(); // click the input to select the file

        // what to do when it gatters the file
        input.onchange = e => {
            let target: HTMLInputElement = e.target as HTMLInputElement;
            if (!target.files) {
                return
            }
            let file: any;
            file = target.files[0];

            let reader = new FileReader(); // file reader
            reader.readAsText(file) // read the file gatered
            // when it is called
            reader.onload = e => {

                if (file.name.includes(".md") || file.name.includes(".txt")) { // check if the file is markdown or txt
                    console.log(e.target?.result?.toString());
                    let result: string | undefined = e.target?.result?.toString();
                    result !== undefined ? setMd(result) : alert("error");
                    unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeCodeTitles).use(rehypePrism, { ignoreMissing: true, showLineNumbers: true }).use(rehypeReact, { createElement, Fragment }).process(md).then(e => {
                        setReactMd(e.result)
                    })
                }
                else {
                    alert("error: el archivo necesita ser tipo markdown o txt")
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
                <div onClick={() => {
                    if (extensions.length > 1) {
                        let e = [...extensions]

                        e.pop()
                        setExtensions(e)
                    }
                    else {
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
