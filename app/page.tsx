'use client';

import { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { send } from '@emailjs/browser';
import moment from 'moment';
import { db } from '../firebase/config';
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
export default function Home() {
  const [message, setMessage] = useState('');

  const [chat, setChat] = useState<{
    is_agent: boolean;
    message: string;
    isDone?: boolean;
  }[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const today = moment().format('ddd, DD MMM, YYYY');

  const EMAIL_SERVICE = 'service_jh6z4lu';
  const EMAIL_TEMPLATE = 'template_k8mm0mx';
  const PUBLIC_KEY = '3ijg6Sqj-JSXxForh';

  const updateFirebaseWorkUpdate = async (workUpdate: string) => {
    const docRef = await addDoc(collection(db, 'workUpdates'), {
      workUpdate: workUpdate,
      date: today,
      subject: 'Work Update',
      sendTo: ['sky32752@gmail.com', 'sarahaadeez21@gmail.com'],
    });
    console.log('Document written with ID: ', docRef.id);
  }

  const sendEmail = async (body: string) => {
    try {
      const response = await send(EMAIL_SERVICE, EMAIL_TEMPLATE, {
        message: body,
        date: today,
        subject: 'Work Update',
        sendTo: ['sky32752@gmail.com', 'sarahaadeez21@gmail.com'],
      }, {
        publicKey : PUBLIC_KEY,
      });
      console.log({ response });
      await updateFirebaseWorkUpdate(body);
      setChat(prev => [...prev.slice(0, -1), { is_agent: true, message: 'Email sent successfully' , id: Date.now() , isDone: true }]);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleWorkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 1) return;
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setChat(prev => [...prev, { is_agent: false, message: message.trim() , id: randomId }]);
 
   const lastMessageEmpty = chat.length > 0 && chat[chat.length - 1].message.length === 0;
   if(lastMessageEmpty){
    setChat(prev => [...prev.slice(0, -1), { is_agent: true, message: '' , id: randomId }]);
   }
    setMessage('')
    const response = await fetch('/api/worker', {
      method: 'POST',
      body: JSON.stringify({ workUpdate: message.trim() }),
    });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';
    
    while (true) {
      const { done, value } = await reader!.read();
      if (done) {
        setChat(prevChat => [
          ...prevChat.slice(0, -1),
          { is_agent: true, message: fullMessage, id: randomId , isDone: true}
        ]);
        break;
      };
      
      const text = decoder.decode(value);
      fullMessage += text;
      if(fullMessage.trim().length > 0){
      setChat(prevChat => [
        ...prevChat.slice(0, -1),
        { is_agent: true, message: fullMessage, id: randomId , isDone: false}
      ]);}
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center px-1">
      <div className="flex flex-col w-[80%] h-[80%] bg-gray-900 rounded-lg shadow-lg shadow-black p-6">
        <h1 className="text-3xl font-bold text-gray-100 font-mono mb-6">
          Welcome to work update agent for EHSsoftware.io
        </h1>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4">
          {chat.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.is_agent ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  item.is_agent
                    ? 'bg-gray-700 text-white'
                    : 'bg-blue-500 text-white ml-auto'
                }`}
              >
                <p className="break-words">{item.message}</p>
                {item.is_agent && item?.isDone && item.message.length > 0 && !item.message.includes("Does not look like a work update.") && (
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => sendEmail(item.message)}
                      className="bg-green-500 font-mono  hover:bg-green-600 text-white text-sm px-3 py-1 rounded-full transition-colors"
                    >
                      Send Email
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.message);
                        alert("Copied to clipboard")
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 font-mono py-1 rounded-full transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleWorkUpdate}
          className="flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="text-black font-mono w-full rounded-full px-6 py-3 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-colors"
          >
            <IoSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
