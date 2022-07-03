import { Router } from 'express'
import MovieController from '../controllers/MovieController'

const movieRouter = Router()

movieRouter.get('/', MovieController.list)

export default movieRouter
