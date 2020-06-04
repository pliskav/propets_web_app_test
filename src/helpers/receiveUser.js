import { xAuthHeader, xUserHeader } from '../utils/requestConst'
import { ACCOUNT_SERVER_PATH } from '../utils/externalPath'

const receiveUser = () => {
  let userInfo = {}

  const token = localStorage.getItem(xAuthHeader)
  const user = localStorage.getItem(xUserHeader)

  const url = `${ACCOUNT_SERVER_PATH}/${user}`

  const myHeaders = new Headers()
  myHeaders.append(
    xAuthHeader,
    token,
  )

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  }

  fetch(url, requestOptions)
  .then((response) => response.json())
  .then((data) => {
    userInfo = { ...data }
  })
  .catch((error) => console.log('error', error))

  return userInfo
}

export default receiveUser