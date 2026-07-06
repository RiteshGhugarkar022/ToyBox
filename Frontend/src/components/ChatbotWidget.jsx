import { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! I am the ToyBox AI assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/api/chat', input, {
        headers: { 'Content-Type': 'text/plain' }
      });
      const botMsg = { sender: 'bot', text: res.data };
      setMessages(prev => [...prev, botMsg]);
    } catch(err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to my brain right now!' }]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-widget" style={styles.container}>
      {isOpen ? (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <h4 style={{margin:0, display:'flex', alignItems:'center', gap:'5px', color:'white'}}>
              <MessageSquare size={18}/> ToyBox AI Assistant
            </h4>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}><X size={20}/></button>
          </div>
          <div style={styles.messagesBody}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{...styles.messageWrapper, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{...styles.messageBubble, background: msg.sender === 'user' ? '#6C5CE7' : '#F1F2F6', color: msg.sender==='user'?'white':'black'}}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div style={{textAlign:'left', fontSize:'0.8rem', color:'gray', margin:'5px'}}>AI is typing...</div>}
          </div>
          <div style={styles.inputArea}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={styles.input}
              placeholder="Ask for toy suggestions..."
            />
            <button onClick={sendMessage} style={styles.sendBtn}><Send size={18}/></button>
          </div>
        </div>
      ) : (
        <button className="chat-fab" onClick={() => setIsOpen(true)} style={styles.fab}>
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

const styles = {
  container: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 },
  fab: { background: '#6C5CE7', color: 'white', border: 'none', borderRadius: '50%', width:'60px', height:'60px', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', boxShadow:'0 5px 20px rgba(0,0,0,0.2)' },
  chatWindow: { width: '350px', height: '450px', background: 'white', borderRadius: '15px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  header: { background: '#6C5CE7', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' },
  messagesBody: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#fafafa' },
  messageWrapper: { display: 'flex', width: '100%', marginBottom: '10px' },
  messageBubble: { padding: '10px 15px', borderRadius: '15px', maxWidth: '80%', fontSize: '0.9rem', lineHeight: '1.4' },
  inputArea: { display: 'flex', padding: '10px', borderTop: '1px solid #eee', background: 'white' },
  input: { flex: 1, padding: '10px 15px', border: '1px solid #ddd', borderRadius: '25px', outline: 'none' },
  sendBtn: { background: '#6C5CE7', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', marginLeft: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default ChatbotWidget;
