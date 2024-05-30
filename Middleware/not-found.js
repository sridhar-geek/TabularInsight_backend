// If user requests routes which are not there it'll give not found error

import {StatusCodes} from 'http-status-codes'

const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route does not exist')
}
export default notFound

