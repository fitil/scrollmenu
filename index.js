import express from 'express'
import path from 'path'
let app = express();

app.use(express.static('./public'))

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
)

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
    console.log('Listening on port '+app.get('port'));
})
