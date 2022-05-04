// import React, { useState, useEffect } from 'react'
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import htmlToDraft  from 'html-to-draftjs';
// export default function NewsEditor(props) {
//   useEffect(() => {
//     if(props.content===null)return
//     const html = props.content;
//     if(html===undefined)return 
//     const contentBlock = htmlToDraft(html);
//     if (contentBlock) {
//       const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//       const editorState = EditorState.createWithContent(contentState);
//       seteditorState(editorState)
//     }

//   }, [props.content])

//   const [editorState, seteditorState] = useState('')
//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         toolbarClassName="toolbarClassName"
//         wrapperClassName="wrapperClassName"
//         editorClassName="editorClassName"
//         onEditorStateChange={(editorState) => seteditorState(editorState)}
//         onBlur={() => {
//           props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
//         }}
//       />
//     </div>
//   )
// }

import { convertToRaw } from 'draft-js'
import React, { useState,useEffect } from 'react'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { ContentState, EditorState } from 'draft-js'

  function NewsEditor(props) {
    const [editorState, seteditorState] = useState('')
    useEffect(() => {
      const html = props.content
      if (html === undefined) return
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        seteditorState(editorState)
      }

    }, [props.content])

    return (
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName='wrapperClassName'
          editorClassName='editorClassName'
          onEditorStateChange={(editorState) => seteditorState(editorState)}
          onBlur={() => {
            let content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            props.getContent(content)
          }}
        />
      </div>
    )
  }
  export default NewsEditor
