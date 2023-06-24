/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useState } from "react";


export default function Exercise02 () {
  const [movies, setMovies] = useState([])
  const [fetchCount, setFetchCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [orderYear, setOrderYear] = useState('Descending')


  const getGenres = async () => {
    setLoading(true)
    await fetch('http://localhost:3001/genres')
      .then(res => res.json())
      .then(data => {
        console.log("DATA, ", data)
        setGenres(data);
      }).catch((e) => {
        console.log("error", e.message);
      });
  }
  const handleMovieFetch = async () => {
    setLoading(true)
    setFetchCount(fetchCount + 1)
    console.log('Getting movies')
    await fetch(`http://localhost:3001/movies?${selectedGenre ? `genres_like=${selectedGenre}` : ''}&_sort=year&_order=${orderYear === "Descending" ? `asc` : `desc`}&_limit=50`)
      .then(res => res.json())
      .then(json => {
        setMovies(json)
        setLoading(false)
      })
      .catch(() => {
        console.log('Run yarn movie-api for fake api')
      })
  }

  useEffect(() => {
    handleMovieFetch()
  }, [selectedGenre, orderYear])

  useEffect(() => {
    getGenres()
  }, [])

  return (
    <section className="movie-library">
      <h1 className="movie-library__title">
        Movie Library
      </h1>
      <div className="movies movie-library__actions">
        <select name="genre" placeholder="Search by genre..." onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value={''}>All</option>
          {genres.map((genre) =>
            <option value={genre}>{genre}</option>)}
        </select>
        <button className="btn btn-success" onClick={() => setOrderYear(orderYear === "Descending" ? "Ascending" : "Descending")}>
          <i className="fas fa-sort-amount-down-alt"></i>
          Order {orderYear}
        </button>
      </div>
      {loading ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (

        <ul className="movie-library__list">
          <div className="row">
            {movies.map(movie => (
              <div class="col-3 pb-3">
                <div class="card w-100 h-100">
                  <li key={movie.id} >
                    <img className="img-fluid" src={movie.posterUrl} alt={movie.title} />

                    <div className="position-absolute gradiant ">
                      <div className="info p-5 w-100 h-100">
                        <p>Title: {movie.title}</p>
                        <p>Year: {movie.year}</p>
                        <p>Genres: {movie.genres.join(', ')}</p>
                      </div>
                    </div>
                  </li>
                </div>
              </div>

            ))}
          </div>
        </ul>

      )
      }
    </section >
  )
}