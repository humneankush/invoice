import express from 'express'
import { updateProfile,deleteProfile ,createProfile ,getProfile,getProfilesByUser} from '../controllers/profile.mjs'



const router = express.Router()






router.get('/:id', getProfile)
// router.get('/', getProfiles)
router.get('/', getProfilesByUser)
router.post('/', createProfile)
router.patch('/:id', updateProfile)
router.delete('/:id', deleteProfile)


export default router