import { useEffect, useRef, useState } from 'react'
// import tutorialsdev from '../../assets/tutorialsdev.png'
import { io } from 'socket.io-client'
import './style.css'
import AgroLog from '../../img/Agro.png'
import userPNG from '../../img/men.png'
import house from '../../img/house.png'
import chatPng from '../../img/chat.png'
import optPng from '../../img/opt.png'
import SendInput from '../../components/sendInput/index'
import imgPng from '../../img/img.png'
import send from '../../img/send.png'

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user:detail'))
  )
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [socket, setSocket] = useState(null)
  const messageRef = useRef(null)

  useEffect(() => {
    setSocket(io('http://localhost:8080'))
  }, [])

  useEffect(() => {
    socket?.emit('addUser', user?.id)
    socket?.on('getUsers', (users) => {
      console.log('activeUsers :>> ', users)
    })
    socket?.on('getMessage', (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }))
    })
  }, [socket])

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.messages])

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const resData = await res.json()
      setConversations(resData)
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      setUsers(resData)
    }
    fetchUsers()
  }, [])

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const resData = await res.json()
    setMessages({ messages: resData, receiver, conversationId })
  }

  const sendMessage = async (e) => {
    setMessage('')
    socket?.emit('sendMessage', {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      conversationId: messages?.conversationId,
    })
    const res = await fetch(`http://localhost:8000/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    })
  }

  return (
    <div className="wrapper">
      <div className="header">
        <div className="header-content">
          <div className="first-content">
            <img src={AgroLog} />
            <h1>Agrobank</h1>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="personality-option">
          <div className="p-con">
            <div className="p-img">
              <img
                src={userPNG}
                style={{
                  width: '100px',
                  height: '100px',
                  marginTop: '32px',
                  borderRadius: '100%',
                }}
              />
            </div>
            <p className="p-name">{user?.fullName}</p>
          </div>
          <div className="p-option">
            <div className="option-1">
              <img src={house} style={{ width: '26px', height: '26px' }} />
              <p className="option-text">Главный экран</p>
            </div>
            <div className="option-1">
              <img src={chatPng} style={{ width: '26px', height: '26px' }} />
              <p className="option-text">Главный экран</p>
            </div>
            <div className="option-1">
              <img src={optPng} style={{ width: '26px', height: '26px' }} />
              <p className="option-text">Главный экран</p>
            </div>
          </div>
        </div>
        <div className="users-con">
          <div className="users-cards">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div
                    className="user"
                    onClick={() => fetchMessages(conversationId, user)}
                  >
                    <div className="u-img">
                      <img
                        src={userPNG}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '100%',
                        }}
                      />
                    </div>
                    <div className="u-info">
                      <p className="u-name">{user?.fullName}</p>
                      <p className="u-email">{user?.email}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div
                className="no-conversation"
                style={{
                  fontWeight: '800',
                  textAlign: 'center',
                  marginTop: '300px',
                  fontSize: '30px',
                }}
              >
                No Conversation
              </div>
            )}
          </div>
        </div>

        <div className="chat-box">
          {messages?.receiver?.fullName && (
            <div className="c-header">
              <div className="c-header_info">
                <h1>{messages?.receiver?.fullName}</h1>
                <p className="time-active">был(а) 5 минут назад</p>
              </div>
            </div>
          )}
          <div className="chat-box_messages">
            <div className="p">
              {messages?.messages?.length > 0 ? (
                messages.messages.map(({ message, user: { id } = {} }) => {
                  return (
                    <>
                      <div
                        className={`message_${
                          id === user?.id ? 'user' : 'receiver'
                        } `}
                      >
                        {message}
                      </div>
                      <div ref={messageRef}></div>
                    </>
                  )
                })
              ) : (
                <div className="no_message">
                  No Messages or No Conversation Selected
                </div>
              )}
            </div>
          </div>
          {messages?.receiver?.fullName && (
            <div className="input-container">
              <img src={imgPng} style={{ width: '20px', marginLeft: '10px' }} />
              <SendInput
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <img
                src={send}
                style={{ width: '40px', cursor: 'pointer' }}
                onClick={() => sendMessage()}
              />
              <div
                className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
                  !message && 'pointer-events-none'
                }`}
              ></div>
            </div>
          )}
        </div>
        <div className="other-users">
          <div className="about-con">
            <h3>Other users</h3>
          </div>
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div
                  className="user-2"
                  onClick={() => fetchMessages('new', user)}
                >
                  <div className="u-img">
                    <img
                      src={userPNG}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '100%',
                      }}
                    />
                  </div>
                  <div className="u-info">
                    <p className="u-name-2">{user?.fullName}</p>
                    <p className="u-email-2">{user?.email}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="no-other-users">No other users</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
