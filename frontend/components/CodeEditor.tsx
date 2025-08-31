'use client'

import { useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
  readOnly?: boolean
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  height = '300px',
  readOnly = false 
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'selection',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
    })

    // Add custom snippets for DSA problems
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = getCodeSnippets(language)
        return { suggestions }
      }
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger run code
      const event = new CustomEvent('runCode')
      window.dispatchEvent(event)
    })
  }

  const getCodeSnippets = (lang: string) => {
    const commonSnippets = [
      {
        label: 'console.log',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'console.log(${1:value});',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Log a value to console'
      },
      {
        label: 'for loop',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'For loop'
      },
      {
        label: 'if statement',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If statement'
      }
    ]

    if (lang === 'javascript') {
      return [
        ...commonSnippets,
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Function declaration'
        },
        {
          label: 'arrow function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:functionName} = (${2:params}) => {\n\t${3:// code}\n};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Arrow function'
        },
        {
          label: 'array methods',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'array.${1|map,filter,reduce,forEach|}(${2:callback})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Array method'
        }
      ]
    }

    if (lang === 'python') {
      return [
        {
          label: 'def function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:function_name}(${2:params}):\n\t${3:# code}\n\treturn ${4:result}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Function definition'
        },
        {
          label: 'for loop',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:# code}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop'
        },
        {
          label: 'if statement',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condition}:\n\t${2:# code}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement'
        },
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'print(${1:value})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Print statement'
        }
      ]
    }

    return commonSnippets
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          readOnly,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnlyMessage: {
            value: 'This editor is read-only'
          }
        }}
      />
    </div>
  )
}