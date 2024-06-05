const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const app = express()
app.use(express.json())
app.disable('x-powered-by')


const ACEPTED_ORIGINS = [
    'http://localhost:8080'
]
app.get('/',(req,res)=>{
    res.json({message: "hola mundo"})
})



app.get('/movies',(req,res)=>{
    
const origin = req.header('origin')
if (ACEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin',origin)
}

    
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(
            g => g.toLowerCase() === genre.toLowerCase()
        ))
        if (filteredMovies.length > 0) return res.json(filteredMovies)
        return res.json({message: "No se han encontrado peliculas con ese genero"})
    }
    return res.json(movies)
})

app.get('/movies/:id',(req,res)=>{
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    return res.status(404).json({message: "Movie not found"})
})

app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id : crypto.randomUUID,
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch(`/movies/:id`,(req,res)=>{
    const result = validatePartialMovie(req.body)
    if (result.error) return res.status(400).json({message: JSON.parse(result.error.message)})
    const { id } = req.params

    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(400).json({message: "Movie not found"})
    
    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})

app.delete(`/movies/:id`,(req,res)=>{
    const origin = req.header('origin')
    if (ACEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin',origin)
}
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(400).json({message: "Movie not found"})

    movies.splice(movieIndex,1)

    return res.json({message: "Movie deleted"})
})

app.options(`/movies/:id`,(req,res)=>{
    const origin = req.header('origin')
    if (ACEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin',origin)
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATH,DELETE')
    
}
res.send(200)
})



const PORT = process.env.PORT ?? 1234

app.listen(PORT,()=>{
    console.log(`server listening on port: http://localhost:${PORT}`)
})