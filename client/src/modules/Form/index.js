import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgroLog from '../../img/Agro.png'
import img1 from '../../img/icon.png'
import img2 from '../../img/2.png'
import img3 from '../../img/3.png'
import check from '../../img/check.png'
import loginImg from '../../img/login.png'
import Input from '../../components/Input/index'
import Button from '../../components/Button/index'
import './style.css'
const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: '',
    }),
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    console.log('data :>>', data)
    e.preventDefault()
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (res.status === 400) {
      alert('Invalid credentials')
    } else {
      const resData = await res.json()
      if (resData.token) {
        localStorage.setItem('user:token', resData.token)
        localStorage.setItem('user:detail', JSON.stringify(resData.user))

        navigate('/')
      }
    }
  }
  return (
    <div className="wrapper">
      <div className="header">
        <div className="header-content">
          <div className="first-content">
            <img src={AgroLog} />
            <h1>Agrobank</h1>
          </div>
          <div className="second-content">
            <img src={img1} style={{ width: '26px' }} />
            <img src={img1} style={{ width: '26px' }} />
            <img src={img2} style={{ width: '26px' }} />
            <img src={img3} style={{ width: '26px' }} />
          </div>
        </div>
      </div>

      <div className="login-modal-container">
        <div className="login-modal">
          <div className="img-container">
            <img src={loginImg} />
          </div>
          <div className="login-container">
            <h2>Вход</h2>
            <div className="form-container">
              <h3>Войдите в аккаунт</h3>
              <p className="welcome-text">
                Добро пожаловать в систему Агробанк Мобайл
              </p>
              <form onSubmit={(e) => handleSubmit(e)}>
                {!isSignInPage && (
                  <Input
                    label="Имя"
                    name="Имя пользователя"
                    placeholder="Введите Имя"
                    value={data.fullName}
                    onChange={(e) =>
                      setData({ ...data, fullName: e.target.value })
                    }
                  />
                )}
                <Input
                  label="Email"
                  name="email"
                  placeholder="Введите Email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <Input
                  label="Код Пароль"
                  name="Код Пароль"
                  placeholder="Введите Код Пароль"
                  type="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <div className="login-option">
                  <img src={check} style={{ width: '20xp', height: '20px' }} />
                  <p className="remember">Запомнить меня </p>
                  <p className="forgot">Забыли пароль?</p>
                </div>
                <Button
                  label={isSignInPage ? 'Войти' : 'Зарегистрироваться'}
                  type="submit"
                />
              </form>
              <div className="register-container">
                {isSignInPage ? 'Нету аккаунта?' : 'Есть аккаунт?'}
                <span
                  className="login-option-link"
                  onClick={() =>
                    navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)
                  }
                >
                  {isSignInPage ? 'Sign up' : 'Sign In'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Form
