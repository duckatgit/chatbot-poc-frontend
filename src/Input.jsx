import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Input() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const chat = (e, message) => {
    e.preventDefault();
    if (!message) return;
    setIsTyping(true);
    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);
    setMessage("");
    fetch("http://localhost:3000/", {
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
    console.log("message111111111", message);
    e.preventDefault();
    chat(e, message);
  };

  //  const handleRegenerate = () => {
  //   let msgs = chats;
  //   fetch("http://localhost:3000/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       chats,
  //     }),
  //   })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data,"===========data================")
  //     console.log(data.output,"===========dataOutput================")
  //     console.log(data.output.message.content
  //       ,"===========dataOutputMessage================")

  //     msgs.push(data.output.message);
  //     setChats(msgs);
  //     setIsTyping(false);
  //   })
  //   .catch((error) => {
  //     console.log("error", error);
  //   });
  //  }

  const handleCopy = () => {
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
    }, 5000);
  };

  return (
    <>
      <main>
        <h1>Your Personal Assistant: Simplifying Communication</h1>
        <section>
          {chats && chats.length
            ? chats.map((chat, index) => (
                <div key={index}>
                  {/* {chat && chat.role === "user" ? (
                      <i className="fa-solid fa-user userIcon" />
                  ) : (
                      <i className="fa-solid fa-robot robotIcon" />
                  )} */}
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
                          onCopy={handleCopy}
                        >
                          <span>
                            {!copiedText ? (
                              <i className="fa-regular fa-clipboard copyIcon" />
                            ) : (
                              <i className="fa-solid fa-check copyIcon" />
                            )}
                          </span>
                        </CopyToClipboard>
                        {/* <i className="fa-solid fa-rotate-left copyIcon1"/> */}
                      </div>
                    )}
                    {/* <br /> */}
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
                onClick={(e) => handleSubmit(e, message)}
              ></i>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default Input;
