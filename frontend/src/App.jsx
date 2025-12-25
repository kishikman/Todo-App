import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client'
import './App.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheckSquare, FaSquare, FaFire, FaClock, FaLongArrowAltUp, FaLongArrowAltDown, FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      isCompleted 
      importance
      urgency
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $importance: Int!, $urgency: Int!) {
    createTodo(createTodoInput: { title: $title, importance: $importance, urgency: $urgency }) {
      id
      title
      isCompleted
      importance
      urgency 
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $isCompleted: Boolean!) {
    updateTodo(updateTodoInput: { id: $id, isCompleted: $isCompleted }) {
      id
      title
      isCompleted
    }
  }
`;

const DELETE_TODO = gql`
  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id) {
      id
    }
  }
`;

function App() {
  const [title, setTitle] = useState("");
  const [importance, setImportance] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const { loading, error, data } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [upDateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  if (loading) return (
    <div className="flex justify-center items-center">
      <div className="w-400 h-400">
        <DotLottieReact src="https://lottie.host/c9bed08d-bee3-4a8e-8391-122bab04871d/fYv5ZeTth0.lottie" loop autoplay />
      </div>
    </div>
  );
  if (error) return <p className='text-center'>エラーが発生しました: {error.message}</p>;

  const area0 = data.todos.filter(t => t.importance === 1 && t.urgency === 1);
  const area1 = data.todos.filter(t => t.importance === 1 && t.urgency === 0);
  const area2 = data.todos.filter(t => t.importance === 0 && t.urgency === 1);
  const area3 = data.todos.filter(t => t.importance === 0 && t.urgency === 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    await createTodo({
       variables: {
         title: title,
         importance: importance ? 1 : 0,
         urgency: urgency ? 1: 0, 
        }
      });
    setTitle("");
    setImportance(false);
    setUrgency(false);
  };

  const handleIsCompleted = async (id, status) => {
    if(status) {
      await upDateTodo({ variables: {id: id, isCompleted: false}});
    } else {
      await upDateTodo({ variables: {id: id, isCompleted: true}});
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("本当に削除しますか？")) {
      await deleteTodo({ variables: { id } });
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (title) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className='flex items-center justify-between w-full gap-10'>
      <div className="w-full max-w-4xl mx-auto min-h-[50vh] min-w-[40vw] flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        <div className='bg-[#e1f1fdd2] rounded-2xl p-10 mx-1  my-3'>
          <div className='flex items-center'>
          {/*重要ボタン*/}
          <div className="flex items-center gap-3 cursor-pointer p-1 my-2 mx-auto" onClick={() => setImportance(!importance)}>
            <div className={`
                relative shrink-0 inline-flex items-center rounded-full transition-colors duration-200 ease-in-out border-none
                w-[34px] h-[22px] 
                ${importance ? 'bg-[#ff4081]' : 'bg-[#eeeeee]'}
            `}>
              <span className={`
                  bg-white shadow-sm absolute rounded-full transition-all duration-200 ease-in-out
                  h-[16px] w-[16px] top-[3px]
                  ${importance ? 'left-[15px]' : 'left-[3px]'}
              `}/>
            </div>
            <span className={"text-lg font-bold text-[#6b6a6aff] hover:text-[#353333ff] transition-colors duration-200"}>重要</span>
          </div>
          
          {/*緊急ボタン*/}
          <div className="flex items-center gap-3 cursor-pointer p-1 my-2 mx-auto" onClick={() => setUrgency(!urgency)}>
            <div className={`
                relative shrink-0 inline-flex items-center rounded-full transition-colors duration-200 ease-in-out border-none
                w-[34px] h-[22px]
                ${urgency ? 'bg-[#0ea5e9]' : 'bg-[#eeeeee]'}
            `}>
              <span className={`
                  bg-white shadow-sm absolute rounded-full transition-all duration-200 ease-in-out
                  h-[16px] w-[16px] top-[3px]
                  ${urgency ? 'left-[15px]' : 'left-[3px]'}
              `}/>
            </div>
            <span className="text-lg font-bold text-[#6b6a6aff] hover:text-[#333] transition-colors duration-200">緊急</span>
          </div>
          </div>
          {/*入力フィールド*/}
          <div className='relative w-full'>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクを入力... "
              onKeyDown={handleKeyDown}
              className="w-full h-40 p-5 text-lg bg-white rounded-2xl focus:outline-none resize-none"
            />
              <button type="submit" disabled={!title} className="absolute bottom-4 right-4 px-6 px-2 rounded-3xl font-bold bg-[#424242ff] text-white">追加 ( Ctrl + Enter )</button>
            </div>
       </div>
      </form>
      
      {/*リスト*/}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-4xl mx-auto min-h-[40vh] min-w-[30vw]">
        <table className="w-full text-left border-collapse minh-40">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-400 w-10 text-center">進捗</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-60 text-center">todo</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-12"></th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-12"></th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-10 text-center">削除</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout" initial={false}>
              {data.todos.map((todo) => (
                <motion.tr 
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* チェックボックス */}
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleIsCompleted(todo.id, todo.isCompleted)} 
                      className="text-xl hover:outline-none focus:outline-none transition-transform active:scale-90 align-middle bg-transparent"
                    >
                      {todo.isCompleted ? <FaCheckSquare className="text-green-500"/> : <FaSquare className="text-slate-200 hover:text-green-400"/>} 
                    </button>
                  </td>
                  
                  {/* タスク名 */}
                  <td className="py-3 px-4">
                    <span className={`font-medium ${todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {todo.title}
                    </span>
                  </td>

                  {/* 重要ラベル */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      {todo.importance === 1 && (
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-[#ff4081] text-white rounded-full text-xs font-bold" title="重要">重要</span>
                      )}
                    </div>
                  </td>
                  
                  {/* 緊急ラベル */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      {todo.urgency === 1 && (
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-[#0ea5e9] text-white rounded-full text-xs font-bold" title="緊急">緊急</span>
                      )}
                    </div>
                  </td>

                  {/* 削除ボタン */}
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleDelete(todo.id)} 
                      className="text-[#6b6a6aff] hover:text-red-500 duration-200 ease-in-out border-none bg-transparent focus:outline-none opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {/* タスクがない場合 */}
            {data.todos.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-slate-400">
                  <div className='flex flex-col items-center justify-center'>
                    <p className='m-4'>タスクはありません</p>
                    <motion.div 
                          layout
                          initial={{ opacity: 0}}
                          animate={{ opacity: 1}}
                          exit={{ opacity: 0}}
                          className="hover:bg-slate-50 w-48 h-40"
                        >
                      <DotLottieReact src="https://lottie.host/ec017a3d-6226-49ab-ab58-9e099996dfa4/5qvUvI4FzE.lottie" loop autoplay />
                    </motion.div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/*マトリクス */}
      <div className="w-full max-w-6xl mt-16 px-2 mb-20">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1fr_3rem] md:grid-rows-[3rem_1fr_1fr] h-auto md:h-[700px]">
          <div className="hidden md:flex items-end justify-center pb-2 font-bold text-slate-500 tracking-widest">
            <p className="px-4 py-1 text-sm flex items-center gap-2">
               緊急ではない
            </p>
          </div>
          <div className="hidden md:flex items-end justify-center pb-2 font-bold text-slate-500 tracking-widest relative">
            <p className="px-4 py-1 text-sm flex items-center gap-2">
               緊急
            </p>
          </div>
          <div className="hidden md:block"></div>

          <MatrixParts tasks={area1} theme={{bg: '#fbf5ff', main: '#e9d5ff'}} handleIsCompleted={handleIsCompleted} handleDelete={handleDelete} />
          <MatrixParts tasks={area0} theme={{bg: '#fff1f2', main: '#fecdd3'}} handleIsCompleted={handleIsCompleted} handleDelete={handleDelete} />
          <div className="hidden md:flex flex-col items-center justify-center font-bold text-slate-500 tracking-widest relative">
             <p className="[writing-mode:vertical-rl] flex items-center gap-3 py-4 px-1 text-sm whitespace-nowrap">
                重要
             </p>
          </div>

          <MatrixParts tasks={area3} theme={{bg: '#f0fdf4', main: '#bbf7d0'}} handleIsCompleted={handleIsCompleted} handleDelete={handleDelete} />
          <MatrixParts tasks={area2} theme={{bg: '#f0f9ff', main: '#bae6fd'}} handleIsCompleted={handleIsCompleted} handleDelete={handleDelete} />
          <div className="hidden md:flex flex-col items-center justify-center font-bold text-slate-500 tracking-widest">
             <p className="[writing-mode:vertical-rl]  flex items-center gap-3 py-4 px-1 text-sm whitespace-nowrap">
               重要ではない 
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const MatrixParts = ({ tasks, theme, handleIsCompleted, handleDelete }) => {
  return (
    <div 
      className={`p-6 flex flex-col border-2 relative overflow-hidden transition-all h-full max-h-[350px] md:max-h-full w-full max-w-2xl mx-auto min-w-[20vw]`}
      style={{
        backgroundColor: theme.bg,
        borderColor: theme.main,
      }}
    >
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.map(todo => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center justify-between bg-white/80 p-3 rounded-2xl border text-sm  hover:shadow-sm transition-all group ${todo.isCompleted ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => handleIsCompleted(todo.id, todo.isCompleted)} className="shrink-0 text-lg focus:outline-none transition-transform active:scale-90">
                   {todo.isCompleted ? <FaCheckSquare className={`text-green-500`}/> : <FaSquare className="text-slate-300 hover:text-slate-400"/>}
                </button>
                <span className={`truncate font-medium ${todo.isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>
                  {todo.title}
                </span>
              </div>
              <button onClick={() => handleDelete(todo.id)} className="text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 shrink-0">
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
    
  );
}

export default App;