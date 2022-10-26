const express = require('express')
const app = express()
const path = require('path')
const router = express.Router();
const PORT = 3001
const __projectdir = __dirname + "/projects"

router.get('/', (req, res) => {
    res.sendFile(path.join(__projectdir + '/portfolio/index.html'))
})

router.get('/im-okay', (req, res) => {
    res.sendFile(path.join(__projectdir + '/im-okay/dist/index.html'))
})


//not done!
router.get('/climbing-route-vis', (req, res) => {
    res.sendFile(path.join(__projectdir + '/climbing-route-vis/dist/index.html'))
})

router.get('/interactive-climbing-gym-map', (req, res) => {
    res.sendFile(path.join(__projectdir + '/interactive-climbing-gym-map/public/index.html'))
})

router.get('/satellites-in-space', (req, res) => {
    res.sendFile(path.join(__projectdir + '/world-from-space/index.html'))
})

//There is a bug with file types of the same name. Keep in mind. Check after portfolio is done
app.use('/', router)
app.use(express.static(__projectdir + "/portfolio/"))
app.use(express.static(__projectdir + "/test-proj/"))
app.use(express.static(__projectdir + "/im-okay/dist/"))
app.use(express.static(__projectdir + "/climbing-route-vis/dist/"))
app.use(express.static(__projectdir + "/interactive-climbing-gym-map/public/"))
app.use(express.static(__projectdir + "/world-from-space/"))


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))