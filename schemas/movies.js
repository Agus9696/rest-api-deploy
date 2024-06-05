const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        required_error: 'Movie title is required',
        invalid_type_error: 'Movie title must be a string'
    }),
    year: z.number({
        required_error: 'Movie year is required',
        invalid_type_error:'Movie year must be a number'
    }).int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url(),
    genre: z.array(
        z.enum(['Action','Sci-Fi','Romance','Thriller','Drama','Crime','Fantasy','Adventure','Animation','Biography'])
    )
})

function validateMovie(object){
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}