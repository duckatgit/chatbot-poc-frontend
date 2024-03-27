import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Chatbot() {
  const [chats, setChats] = useState([{role: "assistant", content: "Hello! How can I assist you today?"}]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chat = (e, message) => {
    e.preventDefault();
    if (!message) return;
    setIsTyping(true);
    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);
    setMessage("");
    fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        msgs.push(data.output.message);
        setChats(msgs);
        setIsTyping(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleSubmit = (e, message) => {
    e.preventDefault();
    chat(e, message);
  };


  const handleCopy = (index) => {
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 5000);
  };

  console.log(chats)

  return (
    <>
      <main >
        <div className="bot-title" >
        <h1>Your Personal Assistant: Simplifying Communication</h1>
        </div>
        <section>
          {chats && chats?.length
            ? chats?.map((chat, index) => (
                <div key={index}>
                  <p className={chat.role === "user" ? "user_msg" : ""}>
                    <span>
                      <b>{chat.role === "user" ? <i className="fa-solid fa-user userIcon" /> : <i className="fa-solid fa-robot robotIcon" />}</b>
                    </span>

                    {chat.role === "user" ? (
                      " "
                    ) : (
                      <div className="copy">
                        <CopyToClipboard
                          text={chat.content}
                          onCopy={() => handleCopy(index)}
                          data-toggle="tooltip" data-placement="right" title="Copy"
                        >
                        <span>
                             {index > 0 ? (  // Check if index is greater than 0
                               copiedIndex === index ? (
                                 <i className="fa-solid fa-check copyIcon" />
                               ) : (
                                 <i className="fa-regular fa-clipboard copyIcon" />
                               )
                             ) : <span style={{visibility: "hidden"}}>- </span>}
                           </span>
                        </CopyToClipboard>
                      </div>
                    )}
                    <span>{chat.content}</span>
                  </p>
                </div>
              ))
            : ""}
        </section>

        <div className={isTyping ? "" : "hide"}>
          <p>
            <i>{isTyping ? "Typing" : ""}</i>
          </p>
        </div>

        <form onSubmit={(e) => chat(e, message)}>
          <div className="formProperties">
            <input
              type="text"
              rows="4"
              column="50"
              name="message"
              value={message}
              autoComplete="off"
              placeholder="Type a message here and hit Enter..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />

            <div className="arrow_up">
              <i
                className="fa-solid fa-arrow-up"
                style={{cursor: "pointer"}}
                onClick={(e) => handleSubmit(e, message)}
                data-toggle="tooltip" data-placement="right" title="Send"
              ></i>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default Chatbot;
